import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter
  serverTimestamp
  increment,
  DocumentSnapshot
} from 'firebase/firestore'
import { firestore as db } from '@/main'
import type {
  TaskTemplate,
  FrameTemplate, 
  ProjectTemplate,
  TemplateApplicationResult,
  TemplateSearchFilters,
  TemplateSearchResult,
  TemplateShare,
  TemplateReview
} from '../lib/template-types'
import {
  TEMPLATE_COLLECTIONS,
  USER_TEMPLATE_COLLECTIONS,
  MOVE_TEMPLATE_COLLECTIONS
} from '../lib/template-types'
import type { Task, Frame, Label } from '../lib/types'
import { PlannerFirebaseService } from './PlannerFirebaseService'

/**
 * Service for managing task, frame, and project templates
 * Handles template creation, sharing, search, and application
 */
export class TemplateService {
  private static searchCache = new Map<string, any>()

  // ===============================================
  // Template CRUD Operations
  // ===============================================

  /**
   * Create a new task template
   */
  static async createTaskTemplate(
    template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>,
    userId: string
  ): Promise<string> {
    const templateRef = doc(collection(db, TEMPLATE_COLLECTIONS.TASK_TEMPLATES))
    const templateData: TaskTemplate = {
      ...template,
      id: templateRef.id,
      usageCount: 0,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: userId
    }

    await setDoc(templateRef, templateData)
    
    // Also save to user's personal collection if not public
    if (!template.isPublic) {
      const userTemplateRef = doc(db, USER_TEMPLATE_COLLECTIONS.TASK_TEMPLATES(userId), templateRef.id)
      await setDoc(userTemplateRef, templateData)
    }

    return templateRef.id
  }

  /**
   * Create a new frame template
   */
  static async createFrameTemplate(
    template: Omit<FrameTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>,
    userId: string
  ): Promise<string> {
    const templateRef = doc(collection(db, TEMPLATE_COLLECTIONS.FRAME_TEMPLATES))
    const templateData: FrameTemplate = {
      ...template,
      id: templateRef.id,
      usageCount: 0,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: userId
    }

    await setDoc(templateRef, templateData)

    if (!template.isPublic) {
      const userTemplateRef = doc(db, USER_TEMPLATE_COLLECTIONS.FRAME_TEMPLATES(userId), templateRef.id)
      await setDoc(userTemplateRef, templateData)
    }

    return templateRef.id
  }

  /**
   * Create a new project template
   */
  static async createProjectTemplate(
    template: Omit<ProjectTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>,
    userId: string
  ): Promise<string> {
    const templateRef = doc(collection(db, TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES))
    const templateData: ProjectTemplate = {
      ...template,
      id: templateRef.id,
      usageCount: 0,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      createdBy: userId
    }

    await setDoc(templateRef, templateData)

    if (!template.isPublic) {
      const userTemplateRef = doc(db, USER_TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES(userId), templateRef.id)
      await setDoc(userTemplateRef, templateData)
    }

    return templateRef.id
  }

  /**
   * Update an existing template
   */
  static async updateTemplate<T extends TaskTemplate | FrameTemplate | ProjectTemplate>(
    templateType: 'task' | 'frame' | 'project',
    templateId: string,
    updates: Partial<T>,
    userId: string
  ): Promise<void> {
    const collections = {
      task: TEMPLATE_COLLECTIONS.TASK_TEMPLATES,
      frame: TEMPLATE_COLLECTIONS.FRAME_TEMPLATES,
      project: TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES
    }

    const templateRef = doc(db, collections[templateType], templateId)
    await updateDoc(templateRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      lastModifiedBy: userId
    })

    // Also update user's personal copy if it exists
    const userCollections = {
      task: USER_TEMPLATE_COLLECTIONS.TASK_TEMPLATES(userId),
      frame: USER_TEMPLATE_COLLECTIONS.FRAME_TEMPLATES(userId),
      project: USER_TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES(userId)
    }

    const userTemplateRef = doc(db, userCollections[templateType], templateId)
    await updateDoc(userTemplateRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }).catch(() => {
      // User template might not exist, ignore error
    })
  }

  /**
   * Delete a template
   */
  static async deleteTemplate(
    templateType: 'task' | 'frame' | 'project',
    templateId: string,
    userId: string
  ): Promise<void> {
    const collections = {
      task: TEMPLATE_COLLECTIONS.TASK_TEMPLATES,
      frame: TEMPLATE_COLLECTIONS.FRAME_TEMPLATES,
      project: TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES
    }

    // Check if user owns the template
    const templateRef = doc(db, collections[templateType], templateId)
    const templateDoc = await templateRef.get()
    
    if (!templateDoc.exists() || templateDoc.data()?.createdBy !== userId) {
      throw new Error('Unauthorized: You can only delete templates you created')
    }

    await deleteDoc(templateRef)

    // Also delete from user's personal collection
    const userCollections = {
      task: USER_TEMPLATE_COLLECTIONS.TASK_TEMPLATES(userId),
      frame: USER_TEMPLATE_COLLECTIONS.FRAME_TEMPLATES(userId), 
      project: USER_TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES(userId)
    }

    const userTemplateRef = doc(db, userCollections[templateType], templateId)
    await deleteDoc(userTemplateRef).catch(() => {
      // User template might not exist, ignore error
    })
  }

  // ===============================================
  // Template Search and Discovery
  // ===============================================

  /**
   * Search templates with filters and pagination
   */
  static async searchTemplates<T = TaskTemplate | FrameTemplate | ProjectTemplate>(
    templateType: 'task' | 'frame' | 'project',
    filters: TemplateSearchFilters = {},
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<TemplateSearchResult<T>> {
    const cacheKey = `${templateType}-${JSON.stringify(filters)}-${pageSize}-${lastDoc?.id || 'first'}`
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)
    }

    const collections = {
      task: TEMPLATE_COLLECTIONS.TASK_TEMPLATES,
      frame: TEMPLATE_COLLECTIONS.FRAME_TEMPLATES,
      project: TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES
    }

    let q = query(collection(db, collections[templateType]))

    // Apply filters
    if (filters.category && filters.category.length > 0) {
      q = query(q, where('category', 'in', filters.category))
    }

    if (filters.isPublic !== undefined) {
      q = query(q, where('isPublic', '==', filters.isPublic))
    }

    if (filters.complexity && filters.complexity.length > 0 && templateType === 'project') {
      q = query(q, where('complexity', 'in', filters.complexity))
    }

    if (filters.createdBy) {
      q = query(q, where('createdBy', '==', filters.createdBy))
    }

    if (filters.maxDuration && templateType === 'project') {
      q = query(q, where('estimatedDuration', '<=', filters.maxDuration))
    }

    // Add ordering and pagination
    q = query(q, orderBy('usageCount', 'desc'), limit(pageSize))
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }

    const snapshot = await getDocs(q)
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))

    // Apply text search filter (client-side for now)
    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase()
      results = results.filter(template => 
        (template as any).name.toLowerCase().includes(searchTerm) ||
        (template as any).description.toLowerCase().includes(searchTerm) ||
        (template as any).tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Apply tag filter (client-side)
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(template =>
        filters.tags!.some(tag => (template as any).tags.includes(tag))
      )
    }

    // Get category and tag counts for faceted search
    const allTemplatesQuery = query(collection(db, collections[templateType]))
    const allSnapshot = await getDocs(allTemplatesQuery)
    const allTemplates = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const categoryGroups = new Map<string, number>()
    const tagGroups = new Map<string, number>()

    (allTemplates || []).forEach(template => {
      // Count categories
      const category = (template as any).category
      categoryGroups.set(category, (categoryGroups.get(category) || 0) + 1)

      // Count tags
      const tags = (template as any).tags || []
      (tags || []).forEach((tag: string) => {
        tagGroups.set(tag, (tagGroups.get(tag) || 0) + 1)
      })
    })

    const searchResult: TemplateSearchResult<T> = {
      results,
      totalCount: results.length,
      categories: Array.from(categoryGroups.entries()).map(([category, count]) => ({
        category: category as any,
        count
      })),
      tags: Array.from(tagGroups.entries()).map(([tag, count]) => ({
        tag,
        count
      }))
    }

    // Cache result for 5 minutes
    this.searchCache.set(cacheKey, searchResult)
    setTimeout(() => this.searchCache.delete(cacheKey), 5 * 60 * 1000)

    return searchResult
  }

  /**
   * Get popular/trending templates
   */
  static async getPopularTemplates(
    templateType: 'task' | 'frame' | 'project',
    limitCount: number = 10
  ): Promise<(TaskTemplate | FrameTemplate | ProjectTemplate)[]> {
    const collections = {
      task: TEMPLATE_COLLECTIONS.TASK_TEMPLATES,
      frame: TEMPLATE_COLLECTIONS.FRAME_TEMPLATES,
      project: TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES
    }

    const q = query(
      collection(db, collections[templateType]),
      where('isPublic', '==', true),
      orderBy('usageCount', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as any)
  }

  /**
   * Get user's personal templates
   */
  static async getUserTemplates(
    userId: string,
    templateType: 'task' | 'frame' | 'project'
  ): Promise<(TaskTemplate | FrameTemplate | ProjectTemplate)[]> {
    const userCollections = {
      task: USER_TEMPLATE_COLLECTIONS.TASK_TEMPLATES(userId),
      frame: USER_TEMPLATE_COLLECTIONS.FRAME_TEMPLATES(userId),
      project: USER_TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES(userId)
    }

    const q = query(
      collection(db, userCollections[templateType]),
      orderBy('updatedAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as any)
  }

  // ===============================================
  // Template Application
  // ===============================================

  /**
   * Apply a task template to create a new task
   */
  static async applyTaskTemplate(
    moveId: string,
    templateId: string,
    userId: string,
    customizations?: {
      title?: string
      frameId?: string
      priority?: string
      assignees?: string[]
    }
  ): Promise<TemplateApplicationResult> {
    try {
      // Get the template
      const templateDoc = doc(db, TEMPLATE_COLLECTIONS.TASK_TEMPLATES, templateId)
      const templateSnapshot = await getDoc(templateDoc)
      
      if (!templateSnapshot.exists()) {
        return {
          success: false,
          itemsCreated: { tasks: [], frames: [], labels: [] },
          errors: [{ type: 'task', templateId, error: 'Template not found' }],
          warnings: []
        }
      }

      const template = { id: templateSnapshot.id, ...templateSnapshot.data() } as TaskTemplate

      // Create task from template
      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: customizations?.title || template.taskData.title,
        description: template.taskData.description,
        status: template.taskData.status,
        priority: customizations?.priority as any || template.taskData.priority,
        completed: false,
        frameId: customizations?.frameId || template.taskData.defaultFrame,
        effort: template.taskData.effort,
        assignees: customizations?.assignees || [],
        labels: [], // Will be resolved from template.taskData.labels
        checklist: template.taskData.checklist?.map((item, index) => ({
          id: `checklist-${index}`,
          text: item.text,
          completed: false
        })),
        customFields: template.taskData.customFields?.map((field, index) => ({
          id: `custom-${index}`,
          name: field.name,
          type: field.type,
          value: field.defaultValue,
          options: field.options
        })),
        defaultFrame: template.taskData.defaultFrame
      }

      // Create the task using PlannerFirebaseService
      const taskId = await PlannerFirebaseService.createTask(moveId, newTask, userId)

      // Update template usage count
      await updateDoc(templateDoc, {
        usageCount: increment(1),
        lastUsedAt: serverTimestamp()
      })

      // Track template application
      const applicationDoc = doc(collection(db, MOVE_TEMPLATE_COLLECTIONS.APPLIED_TEMPLATES(moveId)))
      await setDoc(applicationDoc, {
        templateId,
        templateType: 'task',
        appliedBy: userId,
        appliedAt: serverTimestamp(),
        createdItems: { taskIds: [taskId] }
      })

      return {
        success: true,
        itemsCreated: { tasks: [taskId], frames: [], labels: [] },
        errors: [],
        warnings: []
      }

    } catch (error) {
      return {
        success: false,
        itemsCreated: { tasks: [], frames: [], labels: [] },
        errors: [{ type: 'task', templateId, error: (error as Error).message }],
        warnings: []
      }
    }
  }

  /**
   * Apply a frame template to create a new timeline frame
   */
  static async applyFrameTemplate(
    moveId: string,
    templateId: string,
    userId: string,
    customizations?: {
      title?: string
      color?: string
      offsetStart?: number
      offsetEnd?: number
    }
  ): Promise<TemplateApplicationResult> {
    try {
      const templateDoc = doc(db, TEMPLATE_COLLECTIONS.FRAME_TEMPLATES, templateId)
      const templateSnapshot = await getDoc(templateDoc)
      
      if (!templateSnapshot.exists()) {
        return {
          success: false,
          itemsCreated: { tasks: [], frames: [], labels: [] },
          errors: [{ type: 'frame', templateId, error: 'Template not found' }],
          warnings: []
        }
      }

      const template = { id: templateSnapshot.id, ...templateSnapshot.data() } as FrameTemplate

      // Create frame from template
      const newFrame: Omit<Frame, 'id'> = {
        title: customizations?.title || template.frameData.title,
        color: customizations?.color || template.frameData.color,
        offsetStart: customizations?.offsetStart ?? template.frameData.offsetStart,
        offsetEnd: customizations?.offsetEnd ?? template.frameData.offsetEnd,
        description: template.frameData.description
      }

      const frameId = await PlannerFirebaseService.createFrame(moveId, newFrame, userId)
      const createdItems = { tasks: [], frames: [frameId], labels: [] }

      // Create associated tasks if specified in template
      if (template.frameData.taskTemplateIds && template.frameData.taskTemplateIds.length > 0) {
        for (const taskTemplateId of template.frameData.taskTemplateIds) {
          try {
            const taskResult = await this.applyTaskTemplate(
              moveId,
              taskTemplateId,
              { frameId },
              userId
            )
            createdItems.tasks.push(...taskResult.itemsCreated.tasks)
          } catch (error) {
            // Log error but continue with other tasks
            console.warn(`Failed to create task from template ${taskTemplateId}:`, error)
          }
        }
      }

      // Update template usage count
      await updateDoc(templateDoc, {
        usageCount: increment(1),
        lastUsedAt: serverTimestamp()
      })

      // Track template application
      const applicationDoc = doc(collection(db, MOVE_TEMPLATE_COLLECTIONS.APPLIED_TEMPLATES(moveId)))
      await setDoc(applicationDoc, {
        templateId,
        templateType: 'frame',
        appliedBy: userId,
        appliedAt: serverTimestamp(),
        createdItems
      })

      return {
        success: true,
        itemsCreated: createdItems,
        errors: [],
        warnings: []
      }

    } catch (error) {
      return {
        success: false,
        itemsCreated: { tasks: [], frames: [], labels: [] },
        errors: [{ type: 'frame', templateId, error: (error as Error).message }],
        warnings: []
      }
    }
  }

  /**
   * Apply a complete project template
   */
  static async applyProjectTemplate(
    moveId: string,
    templateId: string,
    userId: string,
    _customizations?: {
      projectName?: string
      startDate?: Date
      skipExistingFrames?: boolean
    }
  ): Promise<TemplateApplicationResult> {
    try {
      const templateDoc = doc(db, TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES, templateId)
      const templateSnapshot = await getDoc(templateDoc)
      
      if (!templateSnapshot.exists()) {
        return {
          success: false,
          itemsCreated: { tasks: [], frames: [], labels: [] },
          errors: [{ type: 'frame', templateId, error: 'Template not found' }],
          warnings: []
        }
      }

      const template = { id: templateSnapshot.id, ...templateSnapshot.data() } as ProjectTemplate
      // const batch = writeBatch(db)
      const result: TemplateApplicationResult = {
        success: true,
        itemsCreated: { tasks: [], frames: [], labels: [] },
        errors: [],
        warnings: []
      }

      // Create labels first
      for (const labelTemplate of template.projectData.labelTemplates) {
        try {
          const labelId = await PlannerFirebaseService.createLabel(moveId, {
            name: labelTemplate.name,
            color: labelTemplate.color,
            category: labelTemplate.category,
            description: labelTemplate.description
          }, userId)
          result.itemsCreated.labels.push(labelId)
        } catch (error) {
          result.warnings.push({
            type: 'duplicate',
            message: `Label "${labelTemplate.name}" may already exist`
          })
        }
      }

      // Create frames
      for (const frameTemplateId of template.projectData.frameTemplateIds) {
        try {
          const frameResult = await this.applyFrameTemplate(moveId, frameTemplateId, undefined, userId)
          result.itemsCreated.frames.push(...frameResult.itemsCreated.frames)
          result.itemsCreated.tasks.push(...frameResult.itemsCreated.tasks)
          result.errors.push(...frameResult.errors)
          result.warnings.push(...frameResult.warnings)
        } catch (error) {
          result.errors.push({
            type: 'frame',
            templateId: frameTemplateId,
            error: (error as Error).message
          })
        }
      }

      // Create standalone tasks
      for (const taskTemplateId of template.projectData.taskTemplateIds) {
        try {
          const taskResult = await this.applyTaskTemplate(moveId, taskTemplateId, undefined, userId)
          result.itemsCreated.tasks.push(...taskResult.itemsCreated.tasks)
          result.errors.push(...taskResult.errors)
          result.warnings.push(...taskResult.warnings)
        } catch (error) {
          result.errors.push({
            type: 'task',
            templateId: taskTemplateId,
            error: (error as Error).message
          })
        }
      }

      // Update project template usage count
      await updateDoc(templateDoc, {
        usageCount: increment(1),
        lastUsedAt: serverTimestamp()
      })

      // Track template application
      const applicationDoc = doc(collection(db, MOVE_TEMPLATE_COLLECTIONS.APPLIED_TEMPLATES(moveId)))
      await setDoc(applicationDoc, {
        templateId,
        templateType: 'project',
        appliedBy: userId,
        appliedAt: serverTimestamp(),
        createdItems: result.itemsCreated
      })

      return result

    } catch (error) {
      return {
        success: false,
        itemsCreated: { tasks: [], frames: [], labels: [] },
        errors: [{ type: 'frame' as const, templateId, error: (error as Error).message }],
        warnings: []
      }
    }
  }

  // ===============================================
  // Template Sharing and Reviews
  // ===============================================

  /**
   * Share a template publicly or with specific users
   */
  static async shareTemplate(
    templateId: string,
    templateType: 'task' | 'frame' | 'project',
    shareConfig: {
      shareType: 'public' | 'link' | 'specific-users'
      allowedUsers?: string[]
      accessLevel: 'view' | 'use' | 'edit'
      expiresAt?: Date
    },
    userId: string
  ): Promise<string> {
    const shareDoc = doc(collection(db, TEMPLATE_COLLECTIONS.TEMPLATE_SHARES))
    const shareData: Omit<TemplateShare, 'id'> = {
      templateId,
      templateType,
      shareType: shareConfig.shareType,
      allowedUsers: shareConfig.allowedUsers,
      accessLevel: shareConfig.accessLevel,
      downloadCount: 0,
      reviews: [],
      shareUrl: shareConfig.shareType === 'link' ? `${window.location.origin}/templates/shared/${shareDoc.id}` : undefined,
      createdAt: serverTimestamp() as any,
      createdBy: userId,
      expiresAt: shareConfig.expiresAt ? serverTimestamp() as any : undefined
    }

    await setDoc(shareDoc, shareData)
    return shareDoc.id
  }

  /**
   * Add a review/rating to a template
   */
  static async reviewTemplate(
    templateId: string,
    review: {
      rating: number
      comment?: string
    },
    userId: string,
    userName: string
  ): Promise<void> {
    const reviewDoc = doc(collection(db, TEMPLATE_COLLECTIONS.TEMPLATE_REVIEWS))
    const reviewData: Omit<TemplateReview, 'id'> = {
      userId,
      userName,
      rating: review.rating,
      comment: review.comment,
      isVerified: false, // Will be updated based on usage tracking
      createdAt: serverTimestamp() as any
    }

    await setDoc(reviewDoc, reviewData)

    // Update template with new review
    const collections = {
      task: TEMPLATE_COLLECTIONS.TASK_TEMPLATES,
      frame: TEMPLATE_COLLECTIONS.FRAME_TEMPLATES,
      project: TEMPLATE_COLLECTIONS.PROJECT_TEMPLATES
    }

    // We would need to determine template type or pass it as parameter
    // For now, we'll search across all collections
    for (const [_type, collectionPath] of Object.entries(collections)) {
      try {
        const templateRef = doc(db, collectionPath, templateId)
        const templateSnap = await getDoc(templateRef)
        if (templateSnap.exists()) {
          await updateDoc(templateRef, {
            [`reviews.${reviewDoc.id}`]: reviewData
          })
          break
        }
      } catch (error) {
        // Continue to next collection
      }
    }
  }

  // ===============================================
  // System Templates (Built-in)
  // ===============================================

  /**
   * Initialize system templates for different move types
   */
  static async initializeSystemTemplates(): Promise<void> {
    // This would be called during app initialization to create
    // built-in templates for common moving scenarios
    
    const systemTemplates = {
      // System task templates
      taskTemplates: [
        {
          name: "Pack Essential Items Box",
          description: "Create a template for packing essential items needed immediately after move",
          category: "residential-move",
          taskData: {
            title: "Pack Essential Items Box",
            description: "Pack a box with items you'll need in the first 24-48 hours after moving",
            priority: "high",
            status: "not-started",
            effort: 2,
            labels: ["packing-organizing"],
            checklist: [
              { text: "Toiletries and medications", isOptional: false },
              { text: "Change of clothes for 2-3 days", isOptional: false },
              { text: "Important documents", isOptional: false },
              { text: "Phone chargers and electronics", isOptional: false },
              { text: "Basic tools and flashlight", isOptional: false },
              { text: "Snacks and beverages", isOptional: true }
            ],
            customFields: [],
            defaultFrame: "1-week"
          },
          isPublic: true,
          isSystem: true,
          tags: ["essentials", "packing", "priority", "residential"]
        }
        // Add more system templates here
      ],
      
      // System frame templates  
      frameTemplates: [
        {
          name: "Pre-Move Week",
          description: "Standard pre-move week timeline with common tasks",
          category: "residential-move",
          frameData: {
            title: "Final Week Preparations", 
            color: "#F97316",
            offsetStart: -7,
            offsetEnd: -1,
            description: "Critical tasks to complete in the week before moving",
            taskTemplateIds: [] // Would reference system task templates
          },
          isPublic: true,
          isSystem: true,
          tags: ["timeline", "preparation", "residential"]
        }
      ],

      // System project templates
      projectTemplates: [
        {
          name: "Standard Residential Move",
          description: "Complete timeline and tasks for a typical residential move",
          category: "residential-move",
          projectData: {
            name: "My Residential Move",
            description: "A comprehensive moving plan with all essential tasks",
            frameTemplateIds: [], // References to system frame templates
            taskTemplateIds: [], // References to system task templates
            labelTemplates: [
              { name: "Packing & Organizing", color: "#8B5CF6", category: "logistics" },
              { name: "Logistics & Transportation", color: "#F59E0B", category: "logistics" },
              { name: "Utilities & Services", color: "#10B981", category: "admin" }
            ],
            settings: {
              autoAssignToCurrentUser: true,
              defaultPriority: "medium",
              enableNotifications: true,
              timelineStartsFrom: "move-date"
            }
          },
          isPublic: true,
          isSystem: true,
          estimatedDuration: 56, // 8 weeks
          complexity: "moderate",
          tags: ["complete", "residential", "timeline", "comprehensive"]
        }
      ]
    }

    // Create system templates (this would typically be done via admin script)
    console.log('System templates defined:', systemTemplates)
    // Implementation would create these templates with isSystem: true
  }
}

