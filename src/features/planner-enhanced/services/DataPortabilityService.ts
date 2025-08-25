import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { firestore as db } from '@/main'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/main'
import type {
  FirebasePlannerTask,
  FirebasePlannerFrame,
  FirebasePlannerLabel,
  FirebasePlannerSettings,
  FirebasePlannerComment,
  FirebasePlannerAttachment,
  FirebasePlannerActivity
} from '../lib/firebase-types'
import type { Task, Frame, Label } from '../lib/types'
import { AnalyticsService } from './AnalyticsService'

// ===============================================
// Export/Import Data Types
// ===============================================

export interface PlannerExportData {
  metadata: {
    exportVersion: string
    moveId: string
    exportDate: string
    exportedBy: string
    exportType: 'full' | 'tasks-only' | 'templates-only' | 'analytics-only'
    plannerVersion: string
  }
  
  data: {
    tasks: Task[]
    frames: Frame[]
    labels: Label[]
    settings?: any
    comments?: Array<{
      id: string
      taskId: string
      text: string
      author: string
      authorName: string
      createdAt: string
    }>
    attachments?: Array<{
      id: string
      taskId: string
      name: string
      fileName: string
      url: string
    }>
    analytics?: any
  }
  
  integrity: {
    taskCount: number
    frameCount: number
    labelCount: number
    checksum: string
  }
}

export interface ImportResult {
  success: boolean
  imported: {
    tasks: number
    frames: number
    labels: number
    comments: number
    attachments: number
  }
  skipped: {
    duplicates: string[]
    invalid: string[]
  }
  errors: Array<{
    type: 'task' | 'frame' | 'label' | 'comment' | 'attachment'
    id: string
    error: string
  }>
  warnings: string[]
}

export interface ExportOptions {
  includeComments?: boolean
  includeAttachments?: boolean
  includeAnalytics?: boolean
  includeCompletedTasks?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  taskFilter?: {
    priorities?: string[]
    statuses?: string[]
    frameIds?: string[]
  }
}

// ===============================================
// Main Data Portability Service
// ===============================================

export class DataPortabilityService {
  private static readonly EXPORT_VERSION = '1.0'
  private static readonly SUPPORTED_FORMATS = ['json', 'csv', 'xlsx', 'pdf'] as const

  // ===============================================
  // Export Functionality
  // ===============================================

  /**
   * Export complete planner data
   */
  static async exportPlannerData(
    moveId: string,
    format: typeof this.SUPPORTED_FORMATS[number] = 'json',
    options: ExportOptions = {},
    userId: string
  ): Promise<{
    downloadUrl: string
    fileName: string
    fileSize: number
  }> {
    AnalyticsService.trackFeatureUsage('data_export', moveId, userId, { format })
    
    const exportData = await this.collectExportData(moveId, options, userId)
    
    let fileContent: Uint8Array
    let fileName: string
    let contentType: string

    switch (format) {
      case 'json':
        fileContent = new TextEncoder().encode(JSON.stringify(exportData, null, 2))
        fileName = `planner-export-${moveId}-${Date.now()}.json`
        contentType = 'application/json'
        break
        
      case 'csv':
        fileContent = await this.generateCSVExport(exportData)
        fileName = `planner-export-${moveId}-${Date.now()}.csv`
        contentType = 'text/csv'
        break
        
      case 'xlsx':
        fileContent = await this.generateExcelExport(exportData)
        fileName = `planner-export-${moveId}-${Date.now()}.xlsx`
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
        
      case 'pdf':
        fileContent = await this.generatePDFExport(exportData)
        fileName = `planner-export-${moveId}-${Date.now()}.pdf`
        contentType = 'application/pdf'
        break
        
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    // Upload to Firebase Storage
    const exportRef = ref(storage, `moves/${moveId}/exports/${fileName}`)
    const uploadResult = await uploadBytes(exportRef, fileContent, { contentType })
    const downloadUrl = await getDownloadURL(uploadResult.ref)

    // Log export activity
    await this.logExportActivity(moveId, {
      format,
      fileName,
      fileSize: fileContent.length,
      options,
      exportedBy: userId
    })

    return {
      downloadUrl,
      fileName,
      fileSize: fileContent.length
    }
  }

  /**
   * Collect all data for export
   */
  private static async collectExportData(
    moveId: string,
    options: ExportOptions,
    userId: string
  ): Promise<PlannerExportData> {
    // Fetch base data
    const [tasks, frames, labels, settings] = await Promise.all([
      this.getTasksForExport(moveId, options),
      this.getFramesForExport(moveId),
      this.getLabelsForExport(moveId),
      this.getSettingsForExport(moveId)
    ])

    // Convert Firebase documents to exportable format
    const exportTasks = tasks.map(this.convertFirebaseTaskToExportTask)
    const exportFrames = frames.map(this.convertFirebaseFrameToExportFrame)
    const exportLabels = labels.map(this.convertFirebaseLabelToExportLabel)

    const exportData: PlannerExportData = {
      metadata: {
        exportVersion: this.EXPORT_VERSION,
        moveId,
        exportDate: new Date().toISOString(),
        exportedBy: userId,
        exportType: 'full',
        plannerVersion: '1.0.0' // TODO: Get from package.json
      },
      data: {
        tasks: exportTasks,
        frames: exportFrames,
        labels: exportLabels,
        settings
      },
      integrity: {
        taskCount: exportTasks.length,
        frameCount: exportFrames.length,
        labelCount: exportLabels.length,
        checksum: await this.generateChecksum(exportTasks, exportFrames, exportLabels)
      }
    }

    // Add optional data
    if (options.includeComments) {
      exportData.data.comments = await this.getCommentsForExport(moveId, exportTasks.map(t => t.id))
    }

    if (options.includeAttachments) {
      exportData.data.attachments = await this.getAttachmentsForExport(moveId, exportTasks.map(t => t.id))
    }

    if (options.includeAnalytics) {
      exportData.data.analytics = await AnalyticsService.generatePlannerAnalytics(moveId)
    }

    return exportData
  }

  // ===============================================
  // Import Functionality
  // ===============================================

  /**
   * Import planner data from exported file
   */
  static async importPlannerData(
    moveId: string,
    importData: PlannerExportData,
    importOptions: {
      overwriteExisting?: boolean
      createNewIds?: boolean
      skipValidation?: boolean
    } = {},
    userId: string
  ): Promise<ImportResult> {
    AnalyticsService.trackFeatureUsage('data_import', moveId, userId)

    const result: ImportResult = {
      success: false,
      imported: { tasks: 0, frames: 0, labels: 0, comments: 0, attachments: 0 },
      skipped: { duplicates: [], invalid: [] },
      errors: [],
      warnings: []
    }

    try {
      // Validate import data
      if (!importOptions.skipValidation) {
        const validation = await this.validateImportData(importData)
        if (!validation.isValid) {
          throw new Error(`Import validation failed: ${validation.errors.join(', ')}`)
        }
        result.warnings.push(...validation.warnings)
      }

      // Check for existing data
      const existingData = await this.getExistingDataForImport(moveId)

      const batch = writeBatch(db)
      let batchCount = 0

      // Import labels first (dependencies for tasks)
      for (const label of importData.data.labels) {
        try {
          const exists = existingData.labels.some(l => l.id === label.id || l.name === label.name)
          
          if (exists && !importOptions.overwriteExisting) {
            result.skipped.duplicates.push(`Label: ${label.name}`)
            continue
          }

          const labelId = importOptions.createNewIds ? `label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : label.id
          const labelDoc = doc(db, `moves/${moveId}/plannerLabels/${labelId}`)
          
          batch.set(labelDoc, {
            id: labelId,
            name: label.name,
            color: label.color,
            description: label.description || '',
            category: label.category || 'custom',
            usageCount: 0,
            order: result.imported.labels,
            isDefault: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: userId
          })

          result.imported.labels++
          batchCount++

          if (batchCount >= 500) {
            await batch.commit()
            batchCount = 0
          }

        } catch (error) {
          result.errors.push({
            type: 'label',
            id: label.id,
            error: (error as Error).message
          })
        }
      }

      // Import frames
      for (const frame of importData.data.frames) {
        try {
          const exists = existingData.frames.some(f => f.id === frame.id)
          
          if (exists && !importOptions.overwriteExisting) {
            result.skipped.duplicates.push(`Frame: ${frame.title}`)
            continue
          }

          const frameId = importOptions.createNewIds ? `frame-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : frame.id
          const frameDoc = doc(db, `moves/${moveId}/plannerFrames/${frameId}`)
          
          batch.set(frameDoc, {
            id: frameId,
            title: frame.title,
            color: frame.color,
            offsetStart: frame.offsetStart,
            offsetEnd: frame.offsetEnd,
            description: frame.description,
            startDate: frame.startDate ? Timestamp.fromDate(new Date(frame.startDate)) : undefined,
            endDate: frame.endDate ? Timestamp.fromDate(new Date(frame.endDate)) : undefined,
            order: result.imported.frames,
            isDefault: false,
            isVisible: true,
            taskIds: [],
            taskCount: 0,
            completedCount: 0,
            isEditable: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: userId,
            lastModifiedBy: userId
          })

          result.imported.frames++
          batchCount++

        } catch (error) {
          result.errors.push({
            type: 'frame',
            id: frame.id,
            error: (error as Error).message
          })
        }
      }

      // Import tasks
      for (const task of importData.data.tasks) {
        try {
          const exists = existingData.tasks.some(t => t.id === task.id)
          
          if (exists && !importOptions.overwriteExisting) {
            result.skipped.duplicates.push(`Task: ${task.title}`)
            continue
          }

          const taskId = importOptions.createNewIds ? `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : task.id
          const taskDoc = doc(db, `moves/${moveId}/plannerTasks/${taskId}`)
          
          batch.set(taskDoc, {
            id: taskId,
            title: task.title,
            description: task.description,
            status: task.status || 'not-started',
            priority: task.priority || 'medium',
            completed: task.completed || false,
            frameId: task.frameId,
            defaultFrame: task.defaultFrame,
            order: result.imported.tasks,
            startDate: task.startDate ? Timestamp.fromDate(new Date(task.startDate)) : undefined,
            dueDate: task.dueDate ? Timestamp.fromDate(new Date(task.dueDate)) : undefined,
            effort: task.effort,
            assignees: task.assignees || [],
            labels: [], // Will be resolved from references
            checklist: task.checklist?.map(item => ({
              id: item.id,
              text: item.text,
              completed: item.completed,
              createdAt: Timestamp.now()
            })) || [],
            customFields: task.customFields?.map(field => ({
              id: field.id,
              name: field.name,
              type: field.type,
              value: field.value,
              options: field.options,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            })) || [],
            attachmentIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: userId,
            lastModifiedBy: userId
          })

          result.imported.tasks++
          batchCount++

        } catch (error) {
          result.errors.push({
            type: 'task',
            id: task.id,
            error: (error as Error).message
          })
        }
      }

      // Commit final batch
      if (batchCount > 0) {
        await batch.commit()
      }

      // Log import activity
      await this.logImportActivity(moveId, {
        importSource: importData.metadata.exportedBy,
        importedBy: userId,
        result
      })

      result.success = result.errors.length === 0

    } catch (error) {
      result.errors.push({
        type: 'task' as const,
        id: 'import-process',
        error: (error as Error).message
      })
    }

    return result
  }

  // ===============================================
  // Format-Specific Export Generators
  // ===============================================

  private static async generateCSVExport(exportData: PlannerExportData): Promise<Uint8Array> {
    const csvLines: string[] = []
    
    // Header
    csvLines.push('Type,ID,Title,Description,Status,Priority,Frame,Due Date,Assignees,Labels,Completed')
    
    // Tasks
    for (const task of exportData.data.tasks) {
      const line = [
        'Task',
        task.id,
        `"${task.title?.replace(/"/g, '""') || ''}"`,
        `"${task.description?.replace(/"/g, '""') || ''}"`,
        task.status || '',
        task.priority || '',
        task.frameId || '',
        task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        task.assignees?.join(';') || '',
        task.labels?.map(l => l.name).join(';') || '',
        task.completed ? 'Yes' : 'No'
      ].join(',')
      csvLines.push(line)
    }
    
    // Frames
    csvLines.push('') // Empty line separator
    csvLines.push('Type,ID,Title,Color,Start Offset,End Offset,Description')
    
    for (const frame of exportData.data.frames) {
      const line = [
        'Frame',
        frame.id,
        `"${frame.title?.replace(/"/g, '""') || ''}"`,
        frame.color || '',
        frame.offsetStart?.toString() || '',
        frame.offsetEnd?.toString() || '',
        `"${frame.description?.replace(/"/g, '""') || ''}"`
      ].join(',')
      csvLines.push(line)
    }

    return new TextEncoder().encode(csvLines.join('\n'))
  }

  private static async generateExcelExport(exportData: PlannerExportData): Promise<Uint8Array> {
    // This would require a library like SheetJS/xlsx
    // For now, return CSV content as placeholder
    const csvContent = await this.generateCSVExport(exportData)
    
    // TODO: Implement actual Excel generation with proper formatting
    // Would include multiple sheets: Tasks, Frames, Labels, Analytics
    
    return csvContent
  }

  private static async generatePDFExport(exportData: PlannerExportData): Promise<Uint8Array> {
    // This would require a library like jsPDF or Puppeteer
    // For now, return a simple text representation
    
    const content = [
      `Planner Export Report - ${exportData.metadata.moveId}`,
      `Generated: ${exportData.metadata.exportDate}`,
      ``,
      `Summary:`,
      `- Tasks: ${exportData.integrity.taskCount}`,
      `- Frames: ${exportData.integrity.frameCount}`,
      `- Labels: ${exportData.integrity.labelCount}`,
      ``,
      `Tasks:`,
      ...exportData.data.tasks.map(task => 
        `• ${task.title} (${task.status}) - ${task.frameId || 'Unassigned'}`
      ),
      ``,
      `Timeline Frames:`,
      ...exportData.data.frames.map(frame =>
        `• ${frame.title} (${frame.offsetStart} to ${frame.offsetEnd} days)`
      )
    ].join('\n')

    return new TextEncoder().encode(content)
  }

  // ===============================================
  // Helper Methods
  // ===============================================

  private static async getTasksForExport(moveId: string, options: ExportOptions): Promise<FirebasePlannerTask[]> {
    const tasksRef = collection(db, `moves/${moveId}/plannerTasks`)
    const snapshot = await getDocs(tasksRef)
    let tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePlannerTask))

    // Apply filters
    if (!options.includeCompletedTasks) {
      tasks = tasks.filter(task => !task.completed)
    }

    if (options.taskFilter) {
      if (options.taskFilter.priorities) {
        tasks = tasks.filter(task => options.taskFilter!.priorities!.includes(task.priority))
      }
      if (options.taskFilter.statuses) {
        tasks = tasks.filter(task => options.taskFilter!.statuses!.includes(task.status))
      }
      if (options.taskFilter.frameIds) {
        tasks = tasks.filter(task => task.frameId && options.taskFilter!.frameIds!.includes(task.frameId))
      }
    }

    if (options.dateRange) {
      const start = Timestamp.fromDate(options.dateRange.start)
      const end = Timestamp.fromDate(options.dateRange.end)
      tasks = tasks.filter(task => 
        task.createdAt && task.createdAt >= start && task.createdAt <= end
      )
    }

    return tasks
  }

  private static async getFramesForExport(moveId: string): Promise<FirebasePlannerFrame[]> {
    const framesRef = collection(db, `moves/${moveId}/plannerFrames`)
    const snapshot = await getDocs(framesRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePlannerFrame))
  }

  private static async getLabelsForExport(moveId: string): Promise<FirebasePlannerLabel[]> {
    const labelsRef = collection(db, `moves/${moveId}/plannerLabels`)
    const snapshot = await getDocs(labelsRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePlannerLabel))
  }

  private static async getSettingsForExport(moveId: string): Promise<any> {
    const settingsDoc = doc(db, `moves/${moveId}/plannerSettings/config`)
    const snapshot = await settingsDoc.get()
    return snapshot.exists() ? snapshot.data() : null
  }

  private static convertFirebaseTaskToExportTask(firebaseTask: FirebasePlannerTask): Task {
    return {
      id: firebaseTask.id,
      title: firebaseTask.title,
      description: firebaseTask.description,
      completed: firebaseTask.completed,
      frameId: firebaseTask.frameId,
      priority: firebaseTask.priority,
      status: firebaseTask.status,
      effort: firebaseTask.effort,
      labels: [], // Would be populated from references
      dueDate: firebaseTask.dueDate?.toDate(),
      startDate: firebaseTask.startDate?.toDate(),
      checklist: firebaseTask.checklist?.map(item => ({
        id: item.id,
        text: item.text,
        completed: item.completed
      })),
      assignees: firebaseTask.assignees,
      customFields: firebaseTask.customFields?.map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        value: field.value,
        options: field.options
      })),
      createdAt: firebaseTask.createdAt?.toDate(),
      updatedAt: firebaseTask.updatedAt?.toDate(),
      defaultFrame: firebaseTask.defaultFrame
    }
  }

  private static convertFirebaseFrameToExportFrame(firebaseFrame: FirebasePlannerFrame): Frame {
    return {
      id: firebaseFrame.id,
      title: firebaseFrame.title,
      color: firebaseFrame.color,
      offsetStart: firebaseFrame.offsetStart,
      offsetEnd: firebaseFrame.offsetEnd,
      description: firebaseFrame.description,
      startDate: firebaseFrame.startDate?.toDate(),
      endDate: firebaseFrame.endDate?.toDate()
    }
  }

  private static convertFirebaseLabelToExportLabel(firebaseLabel: FirebasePlannerLabel): Label {
    return {
      id: firebaseLabel.id,
      name: firebaseLabel.name,
      color: firebaseLabel.color
    }
  }

  private static async generateChecksum(tasks: Task[], frames: Frame[], labels: Label[]): Promise<string> {
    const data = JSON.stringify({ tasks, frames, labels })
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
  }

  private static async validateImportData(importData: PlannerExportData): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []

    // Version compatibility check
    if (importData.metadata.exportVersion !== this.EXPORT_VERSION) {
      warnings.push(`Import data version ${importData.metadata.exportVersion} may not be fully compatible with current version ${this.EXPORT_VERSION}`)
    }

    // Data integrity check
    if (importData.data.tasks.length !== importData.integrity.taskCount) {
      errors.push(`Task count mismatch: expected ${importData.integrity.taskCount}, found ${importData.data.tasks.length}`)
    }

    // Required fields validation
    for (const task of importData.data.tasks) {
      if (!task.id || !task.title) {
        errors.push(`Task missing required fields: ${task.id || 'unknown'}`)
      }
    }

    for (const frame of importData.data.frames) {
      if (!frame.id || !frame.title) {
        errors.push(`Frame missing required fields: ${frame.id || 'unknown'}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private static async getExistingDataForImport(moveId: string): Promise<{
    tasks: FirebasePlannerTask[]
    frames: FirebasePlannerFrame[]
    labels: FirebasePlannerLabel[]
  }> {
    const [tasks, frames, labels] = await Promise.all([
      this.getTasksForExport(moveId, {}),
      this.getFramesForExport(moveId),
      this.getLabelsForExport(moveId)
    ])

    return { tasks, frames, labels }
  }

  private static async getCommentsForExport(moveId: string, taskIds: string[]): Promise<any[]> {
    // Implementation would fetch comments for specified tasks
    return []
  }

  private static async getAttachmentsForExport(moveId: string, taskIds: string[]): Promise<any[]> {
    // Implementation would fetch attachments for specified tasks
    return []
  }

  private static async logExportActivity(moveId: string, details: any): Promise<void> {
    const activityDoc = doc(collection(db, `moves/${moveId}/plannerActivity`))
    await setDoc(activityDoc, {
      type: 'data_export',
      details,
      createdAt: serverTimestamp(),
      userId: details.exportedBy,
      userName: 'Data Export'
    })
  }

  private static async logImportActivity(moveId: string, details: any): Promise<void> {
    const activityDoc = doc(collection(db, `moves/${moveId}/plannerActivity`))
    await setDoc(activityDoc, {
      type: 'data_import',
      details,
      createdAt: serverTimestamp(),
      userId: details.importedBy,
      userName: 'Data Import'
    })
  }
}