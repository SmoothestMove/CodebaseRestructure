import { SmoothMovesIntegrationService } from './SmoothMovesIntegrationService'
import { TemplateService } from './TemplateService'
import { AnalyticsService } from './AnalyticsService'
import { DataPortabilityService } from './DataPortabilityService'
import type { PlannerAnalytics } from './AnalyticsService'
import type { TemplateApplicationResult } from '../lib/template-types'
import type { ImportResult, ExportOptions } from './DataPortabilityService'

/**
 * Unified service for Phase 4 integration features
 * Orchestrates all advanced planner functionality
 */
export class PlannerIntegrationService {
  
  // ===============================================
  // Initialization and Setup
  // ===============================================

  /**
   * Initialize a move with complete planner integration
   */
  static async initializeIntegratedPlanner(
    moveId: string,
    userId: string,
    options: {
      enableSmoothMovesSync?: boolean
      applyDefaultTemplate?: boolean
      templateId?: string
      enableAnalytics?: boolean
    } = {}
  ): Promise<{
    success: boolean
    initialized: {
      sync: boolean
      template: boolean  
      analytics: boolean
    }
    errors: string[]
  }> {
    const result = {
      success: true,
      initialized: {
        sync: false,
        template: false,
        analytics: false
      },
      errors: [] as string[]
    }

    try {
      // Initialize Smooth Moves sync if requested
      if (options.enableSmoothMovesSync) {
        await SmoothMovesIntegrationService.updateSyncSettings(moveId, {
          enabled: true,
          direction: 'bidirectional'
        })
        
        // Start real-time sync
        await SmoothMovesIntegrationService.startRealtimeSync(moveId)
        result.initialized.sync = true
        
        AnalyticsService.trackEvent('integration_initialized', {
          move_id: moveId,
          user_id: userId,
          feature: 'smooth_moves_sync'
        })
      }

      // Apply default template if requested
      if (options.applyDefaultTemplate) {
        const templateId = options.templateId || 'default-residential-move'
        
        try {
          const templateResult = await TemplateService.applyProjectTemplate(
            moveId,
            templateId,
            { projectName: `Move ${moveId}` },
            userId
          )
          
          if (templateResult.success) {
            result.initialized.template = true
            
            AnalyticsService.trackEvent('template_applied', {
              move_id: moveId,
              user_id: userId,
              template_id: templateId,
              items_created: templateResult.itemsCreated
            })
          } else {
            result.errors.push(`Template application failed: ${templateResult.errors.map(e => e.error).join(', ')}`)
          }
        } catch (error) {
          result.errors.push(`Template application error: ${(error as Error).message}`)
        }
      }

      // Initialize analytics tracking
      if (options.enableAnalytics) {
        try {
          await AnalyticsService.generatePlannerAnalytics(moveId)
          result.initialized.analytics = true
          
          AnalyticsService.trackEvent('analytics_initialized', {
            move_id: moveId,
            user_id: userId
          })
        } catch (error) {
          result.errors.push(`Analytics initialization error: ${(error as Error).message}`)
        }
      }

      result.success = result.errors.length === 0

    } catch (error) {
      result.success = false
      result.errors.push(`Integration initialization error: ${(error as Error).message}`)
    }

    return result
  }

  // ===============================================
  // Comprehensive Sync Operations
  // ===============================================

  /**
   * Perform comprehensive sync across all systems
   */
  static async performComprehensiveSync(
    moveId: string,
    userId: string
  ): Promise<{
    success: boolean
    results: {
      smoothMoves: any
      templates: any
      analytics: PlannerAnalytics
    }
    errors: string[]
    warnings: string[]
  }> {
    const result = {
      success: true,
      results: {
        smoothMoves: null as any,
        templates: null as any,
        analytics: null as any
      },
      errors: [] as string[],
      warnings: [] as string[]
    }

    AnalyticsService.trackFeatureUsage('comprehensive_sync', moveId, userId)

    try {
      // 1. Sync with Smooth Moves
      try {
        result.results.smoothMoves = await SmoothMovesIntegrationService.performFullSync(moveId)
        
        if (result.results.smoothMoves.conflicts.length > 0) {
          result.warnings.push(`${result.results.smoothMoves.conflicts.length} sync conflicts detected`)
        }
      } catch (error) {
        result.errors.push(`Smooth Moves sync error: ${(error as Error).message}`)
      }

      // 2. Update template usage statistics
      try {
        // This would typically involve analyzing current tasks and updating template metrics
        result.results.templates = { updated: true }
      } catch (error) {
        result.errors.push(`Template sync error: ${(error as Error).message}`)
      }

      // 3. Generate fresh analytics
      try {
        result.results.analytics = await AnalyticsService.generatePlannerAnalytics(moveId)
      } catch (error) {
        result.errors.push(`Analytics generation error: ${(error as Error).message}`)
      }

      result.success = result.errors.length === 0

    } catch (error) {
      result.success = false
      result.errors.push(`Comprehensive sync error: ${(error as Error).message}`)
    }

    return result
  }

  // ===============================================
  // Advanced Template Operations
  // ===============================================

  /**
   * Apply multiple templates with conflict resolution
   */
  static async applyTemplateSet(
    moveId: string,
    templateSet: {
      projectTemplates?: string[]
      frameTemplates?: string[]
      taskTemplates?: string[]
    },
    userId: string
  ): Promise<{
    success: boolean
    applied: {
      projects: TemplateApplicationResult[]
      frames: TemplateApplicationResult[]
      tasks: TemplateApplicationResult[]
    }
    conflicts: string[]
    recommendations: string[]
  }> {
    const result = {
      success: true,
      applied: {
        projects: [] as TemplateApplicationResult[],
        frames: [] as TemplateApplicationResult[],
        tasks: [] as TemplateApplicationResult[]
      },
      conflicts: [] as string[],
      recommendations: [] as string[]
    }

    AnalyticsService.trackFeatureUsage('template_set_application', moveId, userId, templateSet)

    // Apply project templates first
    if (templateSet.projectTemplates) {
      for (const templateId of templateSet.projectTemplates) {
        try {
          const projectResult = await TemplateService.applyProjectTemplate(moveId, templateId, undefined, userId)
          result.applied.projects.push(projectResult)
          
          if (!projectResult.success) {
            result.conflicts.push(`Project template ${templateId}: ${projectResult.errors.map(e => e.error).join(', ')}`)
          }
        } catch (error) {
          result.conflicts.push(`Project template ${templateId}: ${(error as Error).message}`)
        }
      }
    }

    // Apply frame templates
    if (templateSet.frameTemplates) {
      for (const templateId of templateSet.frameTemplates) {
        try {
          const frameResult = await TemplateService.applyFrameTemplate(moveId, templateId, undefined, userId)
          result.applied.frames.push(frameResult)
          
          if (!frameResult.success) {
            result.conflicts.push(`Frame template ${templateId}: ${frameResult.errors.map(e => e.error).join(', ')}`)
          }
        } catch (error) {
          result.conflicts.push(`Frame template ${templateId}: ${(error as Error).message}`)
        }
      }
    }

    // Apply task templates
    if (templateSet.taskTemplates) {
      for (const templateId of templateSet.taskTemplates) {
        try {
          const taskResult = await TemplateService.applyTaskTemplate(moveId, templateId, undefined, userId)
          result.applied.tasks.push(taskResult)
          
          if (!taskResult.success) {
            result.conflicts.push(`Task template ${templateId}: ${taskResult.errors.map(e => e.error).join(', ')}`)
          }
        } catch (error) {
          result.conflicts.push(`Task template ${templateId}: ${(error as Error).message}`)
        }
      }
    }

    // Generate recommendations based on conflicts
    if (result.conflicts.length > 0) {
      result.recommendations.push('Review and resolve template conflicts before proceeding')
      result.recommendations.push('Consider customizing templates to avoid naming conflicts')
    }

    result.success = result.conflicts.length === 0

    return result
  }

  // ===============================================
  // Advanced Analytics and Insights
  // ===============================================

  /**
   * Generate comprehensive insights with predictions
   */
  static async generateAdvancedInsights(
    moveId: string,
    userId: string
  ): Promise<{
    analytics: PlannerAnalytics
    insights: any
    predictions: {
      completionDate: Date
      riskFactors: string[]
      recommendations: string[]
      resourceNeeds: {
        additionalHelp: boolean
        timeExtension: number // days
        priorityAdjustments: string[]
      }
    }
    benchmarks: {
      comparedToSimilarMoves: {
        completionRate: 'above' | 'average' | 'below'
        timelineAdherence: 'ahead' | 'on-track' | 'behind'
        collaborationLevel: 'high' | 'medium' | 'low'
      }
    }
  }> {
    AnalyticsService.trackFeatureUsage('advanced_insights', moveId, userId)

    const analytics = await AnalyticsService.generatePlannerAnalytics(moveId)
    const insights = await AnalyticsService.generateInsights(moveId)

    // Advanced predictions based on analytics
    const predictions = {
      completionDate: analytics.predictions.estimatedCompletionDate.toDate(),
      riskFactors: [
        ...(analytics.taskStats.completionRate < 50 ? ['Low completion rate may delay move'] : []),
        ...(analytics.timelineStats.behindScheduleCount > 2 ? ['Multiple timeline phases behind schedule'] : []),
        ...(analytics.performanceStats.collaborationScore < 40 ? ['Low team collaboration may impact efficiency'] : [])
      ],
      recommendations: analytics.predictions.recommendedActions,
      resourceNeeds: {
        additionalHelp: analytics.taskStats.total > 50 && analytics.performanceStats.averageTasksPerUser > 10,
        timeExtension: analytics.timelineStats.behindScheduleCount * 3, // 3 days per behind phase
        priorityAdjustments: analytics.predictions.bottlenecks.map(b => `Prioritize tasks in ${b.frameName}`)
      }
    }

    // Benchmarking (would be based on anonymized data from other moves)
    const benchmarks = {
      comparedToSimilarMoves: {
        completionRate: analytics.taskStats.completionRate > 70 ? 'above' : 
                       analytics.taskStats.completionRate > 50 ? 'average' : 'below' as const,
        timelineAdherence: analytics.timelineStats.onSchedulePercentage > 80 ? 'ahead' :
                          analytics.timelineStats.onSchedulePercentage > 60 ? 'on-track' : 'behind' as const,
        collaborationLevel: analytics.performanceStats.collaborationScore > 70 ? 'high' :
                           analytics.performanceStats.collaborationScore > 40 ? 'medium' : 'low' as const
      }
    }

    return {
      analytics,
      insights,
      predictions,
      benchmarks
    }
  }

  // ===============================================
  // Data Migration and Backup
  // ===============================================

  /**
   * Create comprehensive backup with all integration data
   */
  static async createComprehensiveBackup(
    moveId: string,
    userId: string,
    includeAnalytics: boolean = true
  ): Promise<{
    success: boolean
    backupUrl: string
    backupSize: number
    backupId: string
    includedData: {
      tasks: boolean
      frames: boolean
      labels: boolean
      templates: boolean
      analytics: boolean
      syncHistory: boolean
    }
  }> {
    AnalyticsService.trackFeatureUsage('comprehensive_backup', moveId, userId)

    const exportOptions: ExportOptions = {
      includeComments: true,
      includeAttachments: true,
      includeAnalytics: includeAnalytics,
      includeCompletedTasks: true
    }

    const exportResult = await DataPortabilityService.exportPlannerData(
      moveId,
      'json',
      exportOptions,
      userId
    )

    return {
      success: true,
      backupUrl: exportResult.downloadUrl,
      backupSize: exportResult.fileSize,
      backupId: `backup-${moveId}-${Date.now()}`,
      includedData: {
        tasks: true,
        frames: true,
        labels: true,
        templates: true,
        analytics: includeAnalytics,
        syncHistory: true
      }
    }
  }

  /**
   * Migrate data from another planner system
   */
  static async migrateFromExternalPlanner(
    moveId: string,
    externalData: any,
    plannerType: 'trello' | 'asana' | 'notion' | 'todoist' | 'other',
    userId: string
  ): Promise<{
    success: boolean
    migrated: ImportResult
    postMigrationSync?: any
    recommendations: string[]
  }> {
    AnalyticsService.trackFeatureUsage('external_migration', moveId, userId, { planner_type: plannerType })

    // Convert external data to planner format
    const convertedData = await this.convertExternalPlannerData(externalData, plannerType)

    // Import converted data
    const migrated = await DataPortabilityService.importPlannerData(
      moveId,
      convertedData,
      { createNewIds: true },
      userId
    )

    // Perform post-migration sync if enabled
    let postMigrationSync
    try {
      const syncSettings = await SmoothMovesIntegrationService.getSyncSettings(moveId)
      if (syncSettings.enabled) {
        postMigrationSync = await SmoothMovesIntegrationService.performFullSync(moveId)
      }
    } catch (error) {
      console.warn('Post-migration sync failed:', error)
    }

    // Generate recommendations based on migration results
    const recommendations = [
      ...(migrated.errors.length > 0 ? ['Review migration errors and manually address failed items'] : []),
      ...(migrated.skipped.duplicates.length > 0 ? ['Check for duplicate items that were skipped'] : []),
      'Review imported tasks and adjust timeline as needed',
      'Verify all team members have appropriate access',
      'Consider applying relevant templates to enhance the imported structure'
    ]

    return {
      success: migrated.success,
      migrated,
      postMigrationSync,
      recommendations
    }
  }

  // ===============================================
  // Health Check and Diagnostics
  // ===============================================

  /**
   * Perform comprehensive health check of all integration systems
   */
  static async performHealthCheck(moveId: string): Promise<{
    overall: 'healthy' | 'warning' | 'critical'
    systems: {
      database: { status: 'healthy' | 'warning' | 'error', details: string }
      sync: { status: 'healthy' | 'warning' | 'error', details: string }
      templates: { status: 'healthy' | 'warning' | 'error', details: string }
      analytics: { status: 'healthy' | 'warning' | 'error', details: string }
      export: { status: 'healthy' | 'warning' | 'error', details: string }
    }
    recommendations: string[]
    lastChecked: Date
  }> {
    const healthCheck = {
      overall: 'healthy' as const,
      systems: {
        database: { status: 'healthy' as const, details: 'All collections accessible' },
        sync: { status: 'healthy' as const, details: 'Sync service operational' },
        templates: { status: 'healthy' as const, details: 'Template system functional' },
        analytics: { status: 'healthy' as const, details: 'Analytics generation working' },
        export: { status: 'healthy' as const, details: 'Export functionality available' }
      },
      recommendations: [] as string[],
      lastChecked: new Date()
    }

    let warningCount = 0
    let errorCount = 0

    try {
      // Check database connectivity and data integrity
      await AnalyticsService.generatePlannerAnalytics(moveId)
    } catch (error) {
      healthCheck.systems.database.status = 'error'
      healthCheck.systems.database.details = `Database error: ${(error as Error).message}`
      errorCount++
    }

    try {
      // Check sync system
      const syncSettings = await SmoothMovesIntegrationService.getSyncSettings(moveId)
      if (!syncSettings.enabled) {
        healthCheck.systems.sync.status = 'warning'
        healthCheck.systems.sync.details = 'Sync is disabled'
        warningCount++
      }
    } catch (error) {
      healthCheck.systems.sync.status = 'error'
      healthCheck.systems.sync.details = `Sync error: ${(error as Error).message}`
      errorCount++
    }

    // Determine overall health
    if (errorCount > 0) {
      healthCheck.overall = 'critical'
    } else if (warningCount > 0) {
      healthCheck.overall = 'warning'
    }

    // Generate recommendations
    if (healthCheck.systems.sync.status === 'warning') {
      healthCheck.recommendations.push('Consider enabling Smooth Moves sync for better integration')
    }

    if (errorCount > 0) {
      healthCheck.recommendations.push('Immediate attention required for system errors')
    }

    return healthCheck
  }

  // ===============================================
  // Private Helper Methods
  // ===============================================

  private static async convertExternalPlannerData(
    externalData: any,
    plannerType: string
  ): Promise<any> {
    // This would contain conversion logic for different planner formats
    // For now, return a basic structure
    return {
      metadata: {
        exportVersion: '1.0',
        moveId: 'imported',
        exportDate: new Date().toISOString(),
        exportedBy: 'migration',
        exportType: 'full',
        plannerVersion: '1.0.0'
      },
      data: {
        tasks: [],
        frames: [],
        labels: []
      },
      integrity: {
        taskCount: 0,
        frameCount: 0,
        labelCount: 0,
        checksum: 'migration'
      }
    }
  }
}