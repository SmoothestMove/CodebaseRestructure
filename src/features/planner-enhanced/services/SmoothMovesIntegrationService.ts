import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  writeBatch,
  Unsubscribe,
  Timestamp 
} from 'firebase/firestore'
import { firestore as db } from '@/main'
import { taskToSmoothMoves, smoothMovesToTask } from '../lib/types'
import type { Task, Frame, SmoothMovesTask, SmoothMovesTimeframe } from '../lib/types'
import type { FirebasePlannerTask, PLANNER_COLLECTIONS } from '../lib/firebase-types'

/**
 * Service for bidirectional synchronization between Enhanced Planner and Smooth Moves core
 * Handles data conversion, conflict resolution, and real-time sync
 */
export class SmoothMovesIntegrationService {
  private static syncListeners = new Map<string, Unsubscribe>()

  // ===============================================
  // Sync Direction Configuration
  // ===============================================

  static async getSyncSettings(moveId: string): Promise<{
    enabled: boolean
    direction: 'bidirectional' | 'planner-only' | 'smoothmoves-only'
    lastSyncAt?: Date
  }> {
    const settingsDoc = doc(db, `moves/${moveId}/plannerSettings/config`)
    const snapshot = await getDocs(query(collection(db, settingsDoc.path)))
    
    if (snapshot.empty) {
      return { enabled: false, direction: 'bidirectional' }
    }

    const settings = snapshot.docs[0].data()
    return {
      enabled: settings.enableSmoothMovesSync || false,
      direction: settings.syncDirection || 'bidirectional',
      lastSyncAt: settings.lastSyncAt?.toDate()
    }
  }

  static async updateSyncSettings(moveId: string, settings: {
    enabled?: boolean
    direction?: 'bidirectional' | 'planner-only' | 'smoothmoves-only'
  }): Promise<void> {
    const configDoc = doc(db, `moves/${moveId}/plannerSettings/config`)
    await updateDoc(configDoc, {
      ...settings,
      lastSyncAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  // ===============================================
  // Bidirectional Sync Operations
  // ===============================================

  /**
   * Perform full bidirectional sync between planner and Smooth Moves
   */
  static async performFullSync(moveId: string): Promise<{
    tasksSync: { created: number, updated: number, deleted: number }
    framesSync: { created: number, updated: number, deleted: number }
    conflicts: Array<{ id: string, type: 'task' | 'frame', reason: string }>
  }> {
    const syncSettings = await this.getSyncSettings(moveId)
    if (!syncSettings.enabled) {
      throw new Error('Smooth Moves sync is disabled for this move')
    }

    const batch = writeBatch(db)
    const conflicts: Array<{ id: string, type: 'task' | 'frame', reason: string }> = []

    // Sync tasks
    const taskResults = await this.syncTasks(moveId, syncSettings.direction, batch)
    
    // Sync frames/timeframes
    const frameResults = await this.syncFrames(moveId, syncSettings.direction, batch)

    // Commit all changes atomically
    await batch.commit()

    // Log sync activity
    await this.logSyncActivity(moveId, {
      direction: syncSettings.direction,
      tasksSync: taskResults,
      framesSync: frameResults,
      conflicts
    })

    return {
      tasksSync: taskResults,
      framesSync: frameResults,
      conflicts
    }
  }

  /**
   * Sync tasks between planner and Smooth Moves
   */
  private static async syncTasks(
    moveId: string, 
    direction: string, 
    batch: any
  ): Promise<{ created: number, updated: number, deleted: number }> {
    let created = 0, updated = 0, deleted = 0

    // Get planner tasks
    const plannerTasksRef = collection(db, `moves/${moveId}/plannerTasks`)
    const plannerSnapshot = await getDocs(plannerTasksRef)
    const plannerTasks = plannerSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }) as FirebasePlannerTask)

    // Get Smooth Moves tasks (from existing categories/boxes)
    const smoothMovesTasksRef = collection(db, `moves/${moveId}/tasks`)
    const smoothMovesSnapshot = await getDocs(smoothMovesTasksRef)
    const smoothMovesTasks = smoothMovesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as SmoothMovesTask)

    if (direction === 'bidirectional' || direction === 'planner-only') {
      // Sync planner tasks to Smooth Moves
      for (const plannerTask of plannerTasks) {
        const smoothMovesTask = taskToSmoothMoves({
          id: plannerTask.id,
          title: plannerTask.title,
          description: plannerTask.description,
          completed: plannerTask.completed,
          frameId: plannerTask.frameId,
          priority: plannerTask.priority,
          status: plannerTask.status,
          effort: plannerTask.effort,
          labels: [], // Will be resolved from references
          dueDate: plannerTask.dueDate?.toDate(),
          startDate: plannerTask.startDate?.toDate(),
          checklist: plannerTask.checklist?.map(item => ({
            id: item.id,
            text: item.text,
            completed: item.completed
          })),
          assignees: plannerTask.assignees,
          createdAt: plannerTask.createdAt?.toDate(),
          updatedAt: plannerTask.updatedAt?.toDate(),
          defaultFrame: plannerTask.defaultFrame
        })

        const existingSmoothTask = smoothMovesTasks.find(t => t.id === plannerTask.id)
        const smoothTaskDoc = doc(db, `moves/${moveId}/tasks/${plannerTask.id}`)

        if (!existingSmoothTask) {
          batch.set(smoothTaskDoc, {
            ...smoothMovesTask,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          created++
        } else if (plannerTask.updatedAt && new Date(existingSmoothTask.updatedAt) < plannerTask.updatedAt.toDate()) {
          batch.update(smoothTaskDoc, {
            ...smoothMovesTask,
            updatedAt: serverTimestamp()
          })
          updated++
        }
      }
    }

    if (direction === 'bidirectional' || direction === 'smoothmoves-only') {
      // Sync Smooth Moves tasks to planner
      for (const smoothTask of smoothMovesTasks) {
        const plannerTask = smoothMovesToTask(smoothTask)
        
        const existingPlannerTask = plannerTasks.find(t => t.id === smoothTask.id)
        const plannerTaskDoc = doc(db, `moves/${moveId}/plannerTasks/${smoothTask.id}`)

        if (!existingPlannerTask) {
          batch.set(plannerTaskDoc, {
            id: plannerTask.id,
            title: plannerTask.title,
            description: plannerTask.description,
            status: plannerTask.status || 'not-started',
            priority: plannerTask.priority || 'medium',
            completed: plannerTask.completed || false,
            frameId: plannerTask.frameId,
            defaultFrame: plannerTask.defaultFrame,
            order: 0,
            startDate: plannerTask.startDate ? Timestamp.fromDate(plannerTask.startDate) : undefined,
            dueDate: plannerTask.dueDate ? Timestamp.fromDate(plannerTask.dueDate) : undefined,
            effort: plannerTask.effort,
            assignees: plannerTask.assignees || [],
            labels: [],
            checklist: plannerTask.checklist?.map(item => ({
              id: item.id,
              text: item.text,
              completed: item.completed,
              createdAt: Timestamp.now()
            })) || [],
            customFields: [],
            attachmentIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: 'system-sync',
            lastModifiedBy: 'system-sync'
          })
          created++
        } else if (new Date(smoothTask.updatedAt) > (existingPlannerTask.updatedAt?.toDate() || new Date(0))) {
          batch.update(plannerTaskDoc, {
            title: plannerTask.title,
            description: plannerTask.description,
            status: plannerTask.status,
            priority: plannerTask.priority,
            completed: plannerTask.completed,
            updatedAt: serverTimestamp(),
            lastModifiedBy: 'system-sync'
          })
          updated++
        }
      }
    }

    return { created, updated, deleted }
  }

  /**
   * Sync frames/timeframes between planner and Smooth Moves
   */
  private static async syncFrames(
    moveId: string, 
    direction: string, 
    batch: any
  ): Promise<{ created: number, updated: number, deleted: number }> {
    let created = 0, updated = 0, deleted = 0

    // Get planner frames
    const plannerFramesRef = collection(db, `moves/${moveId}/plannerFrames`)
    const plannerSnapshot = await getDocs(plannerFramesRef)
    const plannerFrames = plannerSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }))

    // Get Smooth Moves timeframes
    const timeframesRef = collection(db, `moves/${moveId}/timeframes`)
    const timeframesSnapshot = await getDocs(timeframesRef)
    const timeframes = timeframesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as SmoothMovesTimeframe)

    if (direction === 'bidirectional' || direction === 'planner-only') {
      // Sync planner frames to Smooth Moves timeframes
      for (const frame of plannerFrames) {
        const timeframe: SmoothMovesTimeframe = {
          id: frame.id,
          title: frame.title,
          description: frame.description,
          taskIds: frame.taskIds || [],
          color: frame.color,
          isDefault: frame.isDefault || false,
          order: frame.order || 0,
          dateOffset: frame.offsetStart,
          dateRange: frame.description || `${frame.offsetStart} days`,
          createdAt: frame.createdAt?.toMillis(),
          updatedAt: frame.updatedAt?.toMillis()
        }

        const existingTimeframe = timeframes.find(t => t.id === frame.id)
        const timeframeDoc = doc(db, `moves/${moveId}/timeframes/${frame.id}`)

        if (!existingTimeframe) {
          batch.set(timeframeDoc, {
            ...timeframe,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          created++
        } else {
          batch.update(timeframeDoc, {
            ...timeframe,
            updatedAt: serverTimestamp()
          })
          updated++
        }
      }
    }

    return { created, updated, deleted }
  }

  // ===============================================
  // Real-time Sync Listeners
  // ===============================================

  /**
   * Start real-time bidirectional sync
   */
  static async startRealtimeSync(moveId: string): Promise<void> {
    const syncSettings = await this.getSyncSettings(moveId)
    if (!syncSettings.enabled) {
      return
    }

    // Stop existing listeners
    this.stopRealtimeSync(moveId)

    // Listen to planner task changes
    if (syncSettings.direction === 'bidirectional' || syncSettings.direction === 'planner-only') {
      const plannerTasksRef = collection(db, `moves/${moveId}/plannerTasks`)
      const unsubscribeP = onSnapshot(plannerTasksRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            this.syncTaskToSmoothMoves(moveId, change.doc.id, { 
              id: change.doc.id, 
              ...change.doc.data() 
            } as FirebasePlannerTask)
          } else if (change.type === 'removed') {
            this.removeSmoothMovesTask(moveId, change.doc.id)
          }
        })
      })
      this.syncListeners.set(`${moveId}-planner-tasks`, unsubscribeP)
    }

    // Listen to Smooth Moves task changes  
    if (syncSettings.direction === 'bidirectional' || syncSettings.direction === 'smoothmoves-only') {
      const smoothTasksRef = collection(db, `moves/${moveId}/tasks`)
      const unsubscribeS = onSnapshot(smoothTasksRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            this.syncTaskToPlanner(moveId, change.doc.id, {
              id: change.doc.id,
              ...change.doc.data()
            } as SmoothMovesTask)
          } else if (change.type === 'removed') {
            this.removePlannerTask(moveId, change.doc.id)
          }
        })
      })
      this.syncListeners.set(`${moveId}-smooth-tasks`, unsubscribeS)
    }
  }

  /**
   * Stop real-time sync listeners
   */
  static stopRealtimeSync(moveId: string): void {
    const plannerListener = this.syncListeners.get(`${moveId}-planner-tasks`)
    const smoothListener = this.syncListeners.get(`${moveId}-smooth-tasks`)
    
    plannerListener?.()
    smoothListener?.()
    
    this.syncListeners.delete(`${moveId}-planner-tasks`)
    this.syncListeners.delete(`${moveId}-smooth-tasks`)
  }

  // ===============================================
  // Individual Sync Operations
  // ===============================================

  private static async syncTaskToSmoothMoves(moveId: string, taskId: string, plannerTask: FirebasePlannerTask): Promise<void> {
    try {
      const smoothMovesTask = taskToSmoothMoves({
        id: plannerTask.id,
        title: plannerTask.title,
        description: plannerTask.description,
        completed: plannerTask.completed,
        frameId: plannerTask.frameId,
        priority: plannerTask.priority,
        status: plannerTask.status,
        effort: plannerTask.effort,
        dueDate: plannerTask.dueDate?.toDate(),
        startDate: plannerTask.startDate?.toDate(),
        checklist: plannerTask.checklist?.map(item => ({
          id: item.id,
          text: item.text,
          completed: item.completed
        })),
        assignees: plannerTask.assignees,
        createdAt: plannerTask.createdAt?.toDate(),
        updatedAt: plannerTask.updatedAt?.toDate(),
        defaultFrame: plannerTask.defaultFrame
      })

      const smoothTaskDoc = doc(db, `moves/${moveId}/tasks/${taskId}`)
      await setDoc(smoothTaskDoc, {
        ...smoothMovesTask,
        syncedAt: serverTimestamp(),
        syncSource: 'planner'
      }, { merge: true })

    } catch (error) {
      console.error('Error syncing task to Smooth Moves:', error)
      await this.logSyncError(moveId, 'task-to-smooth', taskId, error as Error)
    }
  }

  private static async syncTaskToPlanner(moveId: string, taskId: string, smoothTask: SmoothMovesTask): Promise<void> {
    try {
      const plannerTask = smoothMovesToTask(smoothTask)

      const plannerTaskDoc = doc(db, `moves/${moveId}/plannerTasks/${taskId}`)
      await setDoc(plannerTaskDoc, {
        id: plannerTask.id,
        title: plannerTask.title,
        description: plannerTask.description,
        status: plannerTask.status || 'not-started',
        priority: plannerTask.priority || 'medium',
        completed: plannerTask.completed || false,
        frameId: plannerTask.frameId,
        defaultFrame: plannerTask.defaultFrame,
        order: 0,
        startDate: plannerTask.startDate ? Timestamp.fromDate(plannerTask.startDate) : undefined,
        dueDate: plannerTask.dueDate ? Timestamp.fromDate(plannerTask.dueDate) : undefined,
        effort: plannerTask.effort,
        assignees: plannerTask.assignees || [],
        labels: [],
        checklist: plannerTask.checklist?.map(item => ({
          id: item.id,
          text: item.text,
          completed: item.completed,
          createdAt: Timestamp.now()
        })) || [],
        customFields: [],
        attachmentIds: [],
        updatedAt: serverTimestamp(),
        createdBy: smoothTask.assignedMember || 'system-sync',
        lastModifiedBy: 'system-sync',
        syncedAt: serverTimestamp(),
        syncSource: 'smooth-moves'
      }, { merge: true })

    } catch (error) {
      console.error('Error syncing task to planner:', error)
      await this.logSyncError(moveId, 'smooth-to-task', taskId, error as Error)
    }
  }

  private static async removeSmoothMovesTask(moveId: string, taskId: string): Promise<void> {
    const smoothTaskDoc = doc(db, `moves/${moveId}/tasks/${taskId}`)
    await deleteDoc(smoothTaskDoc)
  }

  private static async removePlannerTask(moveId: string, taskId: string): Promise<void> {
    const plannerTaskDoc = doc(db, `moves/${moveId}/plannerTasks/${taskId}`)
    await deleteDoc(plannerTaskDoc)
  }

  // ===============================================
  // Sync Activity Logging
  // ===============================================

  private static async logSyncActivity(moveId: string, activity: {
    direction: string
    tasksSync: { created: number, updated: number, deleted: number }
    framesSync: { created: number, updated: number, deleted: number }
    conflicts: Array<{ id: string, type: 'task' | 'frame', reason: string }>
  }): Promise<void> {
    const activityDoc = doc(collection(db, `moves/${moveId}/plannerActivity`))
    await setDoc(activityDoc, {
      type: 'smooth_moves_sync',
      details: activity,
      createdAt: serverTimestamp(),
      userId: 'system',
      userName: 'System Sync'
    })
  }

  private static async logSyncError(moveId: string, operation: string, resourceId: string, error: Error): Promise<void> {
    const errorDoc = doc(collection(db, `moves/${moveId}/plannerActivity`))
    await setDoc(errorDoc, {
      type: 'sync_error',
      operation,
      resourceId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      createdAt: serverTimestamp(),
      userId: 'system',
      userName: 'System Error'
    })
  }

  // ===============================================
  // Migration Utilities
  // ===============================================

  /**
   * One-time migration of existing Smooth Moves data to planner
   */
  static async migrateExistingData(moveId: string): Promise<{
    tasksMigrated: number
    framesMigrated: number
    errors: string[]
  }> {
    const errors: string[] = []
    let tasksMigrated = 0
    let framesMigrated = 0

    try {
      // Check if planner is already initialized
      const plannerTasksRef = collection(db, `moves/${moveId}/plannerTasks`)
      const existing = await getDocs(plannerTasksRef)
      
      if (!existing.empty) {
        throw new Error('Planner already contains data. Use sync instead of migration.')
      }

      // Migrate tasks
      const smoothTasksRef = collection(db, `moves/${moveId}/tasks`)
      const tasksSnapshot = await getDocs(smoothTasksRef)
      const batch = writeBatch(db)

      for (const taskDoc of tasksSnapshot.docs) {
        try {
          const smoothTask = { id: taskDoc.id, ...taskDoc.data() } as SmoothMovesTask
          const plannerTask = smoothMovesToTask(smoothTask)
          
          const plannerTaskDoc = doc(db, `moves/${moveId}/plannerTasks/${taskDoc.id}`)
          batch.set(plannerTaskDoc, {
            id: plannerTask.id,
            title: plannerTask.title,
            description: plannerTask.description,
            status: plannerTask.status || 'not-started',
            priority: plannerTask.priority || 'medium',
            completed: plannerTask.completed || false,
            frameId: plannerTask.frameId || plannerTask.defaultFrame,
            defaultFrame: plannerTask.defaultFrame,
            order: tasksMigrated,
            startDate: plannerTask.startDate ? Timestamp.fromDate(plannerTask.startDate) : undefined,
            dueDate: plannerTask.dueDate ? Timestamp.fromDate(plannerTask.dueDate) : undefined,
            effort: plannerTask.effort,
            assignees: plannerTask.assignees || [],
            labels: [],
            checklist: plannerTask.checklist?.map(item => ({
              id: item.id,
              text: item.text,
              completed: item.completed,
              createdAt: Timestamp.now()
            })) || [],
            customFields: [],
            attachmentIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: smoothTask.assignedMember || 'migration',
            lastModifiedBy: 'migration'
          })
          tasksMigrated++
        } catch (error) {
          errors.push(`Task ${taskDoc.id}: ${(error as Error).message}`)
        }
      }

      await batch.commit()

      // Log migration activity
      await this.logSyncActivity(moveId, {
        direction: 'migration',
        tasksSync: { created: tasksMigrated, updated: 0, deleted: 0 },
        framesSync: { created: framesMigrated, updated: 0, deleted: 0 },
        conflicts: []
      })

    } catch (error) {
      errors.push(`Migration failed: ${(error as Error).message}`)
    }

    return { tasksMigrated, framesMigrated, errors }
  }
}