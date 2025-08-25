import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  serverTimestamp,
  writeBatch,
  increment,
  Timestamp,
  runTransaction
} from 'firebase/firestore'
import { firestore as db } from '@/main'
import { getAnalytics, logEvent } from 'firebase/analytics'
import type { FirebasePlannerTask, FirebasePlannerFrame, FirebasePlannerActivity } from '../lib/firebase-types'

// ===============================================
// Analytics Data Types
// ===============================================

export interface PlannerAnalytics {
  moveId: string
  
  // Task Analytics
  taskStats: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
    cancelled: number
    blocked: number
    completionRate: number
    averageCompletionTime: number // hours
    tasksByPriority: Record<string, number>
    tasksByFrame: Record<string, number>
  }
  
  // Timeline Analytics
  timelineStats: {
    totalFrames: number
    activeFrames: number
    completedFrames: number
    currentPhase: string
    daysUntilMove: number
    onSchedulePercentage: number
    behindScheduleCount: number
    aheadOfScheduleCount: number
  }
  
  // User Activity Analytics
  activityStats: {
    totalActions: number
    dailyActivity: Record<string, number> // date -> action count
    weeklyActivity: Record<string, number> // week -> action count
    mostActiveUsers: Array<{ userId: string, userName: string, actionCount: number }>
    peakActivityHours: number[] // hours of day with most activity
  }
  
  // Performance Analytics
  performanceStats: {
    averageTasksPerFrame: number
    averageTasksPerUser: number
    collaborationScore: number // 0-100 based on user interactions
    efficiencyScore: number // 0-100 based on completion vs estimates
    plannerUsageScore: number // 0-100 based on feature utilization
  }
  
  // Predictive Analytics
  predictions: {
    estimatedCompletionDate: Date
    riskAssessment: 'low' | 'medium' | 'high'
    recommendedActions: string[]
    bottlenecks: Array<{ frameId: string, frameName: string, reason: string }>
  }
  
  // Generated metadata
  generatedAt: Timestamp
  dataRange: {
    startDate: Timestamp
    endDate: Timestamp
  }
}

export interface UsageMetrics {
  // Feature Usage
  featureUsage: {
    taskCreation: number
    taskCompletion: number
    dragAndDrop: number
    timelineNavigation: number
    searchUsage: number
    filterUsage: number
    templateUsage: number
    commentUsage: number
    attachmentUsage: number
  }
  
  // Time-based metrics
  sessionMetrics: {
    averageSessionLength: number // minutes
    totalSessions: number
    activeUsers: number
    returnUsers: number
    sessionsByTimeOfDay: Record<string, number>
    sessionsByDayOfWeek: Record<string, number>
  }
  
  // Error and Performance Metrics
  performanceMetrics: {
    averageLoadTime: number
    errorRate: number
    syncFailures: number
    crashRate: number
    offlineUsage: number
  }
}

// ===============================================
// Main Analytics Service
// ===============================================

export class AnalyticsService {
  private static analytics = getAnalytics()
  private static metricsCache = new Map<string, { data: any, timestamp: number }>()

  // ===============================================
  // Core Analytics Generation
  // ===============================================

  /**
   * Generate comprehensive analytics for a move
   */
  static async generatePlannerAnalytics(moveId: string): Promise<PlannerAnalytics> {
    const cacheKey = `analytics-${moveId}`
    const cached = this.metricsCache.get(cacheKey)
    
    // Return cached data if less than 10 minutes old
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      return cached.data
    }

    // Fetch all required data
    const [tasks, frames, activities] = await Promise.all([
      this.getTasks(moveId),
      this.getFrames(moveId),
      this.getRecentActivity(moveId, 30) // Last 30 days
    ])

    const analytics: PlannerAnalytics = {
      moveId,
      taskStats: await this.calculateTaskStats(tasks),
      timelineStats: await this.calculateTimelineStats(frames, tasks),
      activityStats: await this.calculateActivityStats(activities),
      performanceStats: await this.calculatePerformanceStats(tasks, frames, activities),
      predictions: await this.generatePredictions(tasks, frames, activities),
      generatedAt: Timestamp.now(),
      dataRange: {
        startDate: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        endDate: Timestamp.now()
      }
    }

    // Cache the result
    this.metricsCache.set(cacheKey, { data: analytics, timestamp: Date.now() })

    // Store analytics in Firestore for historical tracking
    await this.storeAnalyticsSnapshot(moveId, analytics)

    return analytics
  }

  /**
   * Calculate task-related statistics
   */
  private static async calculateTaskStats(tasks: FirebasePlannerTask[]): Promise<PlannerAnalytics['taskStats']> {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const notStarted = tasks.filter(t => t.status === 'not-started').length
    const cancelled = tasks.filter(t => t.status === 'cancelled').length
    const blocked = tasks.filter(t => t.status === 'blocked').length
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0

    // Calculate average completion time for completed tasks
    const completedTasks = tasks.filter(t => t.completed && t.createdAt && t.updatedAt)
    const averageCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          const created = task.createdAt!.toDate()
          const updated = task.updatedAt!.toDate()
          return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
        }, 0) / completedTasks.length
      : 0

    // Group tasks by priority
    const tasksByPriority = tasks.reduce((acc, task) => {
      const priority = task.priority || 'medium'
      acc[priority] = (acc[priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Group tasks by frame
    const tasksByFrame = tasks.reduce((acc, task) => {
      const frameId = task.frameId || 'unassigned'
      acc[frameId] = (acc[frameId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      completed,
      inProgress,
      notStarted,
      cancelled,
      blocked,
      completionRate,
      averageCompletionTime,
      tasksByPriority,
      tasksByFrame
    }
  }

  /**
   * Calculate timeline-related statistics
   */
  private static async calculateTimelineStats(
    frames: FirebasePlannerFrame[], 
    tasks: FirebasePlannerTask[]
  ): Promise<PlannerAnalytics['timelineStats']> {
    const totalFrames = frames.length
    const activeFrames = frames.filter(f => f.taskCount > 0).length
    const completedFrames = frames.filter(f => f.completedCount === f.taskCount && f.taskCount > 0).length

    // Determine current phase based on today's date
    const today = new Date()
    const currentPhase = frames.find(frame => {
      const frameStart = frame.startDate?.toDate()
      const frameEnd = frame.endDate?.toDate()
      return frameStart && frameEnd && today >= frameStart && today <= frameEnd
    })?.title || 'Unknown'

    // Calculate days until move (assuming move-day frame exists)
    const moveDayFrame = frames.find(f => f.id === 'move-day')
    const daysUntilMove = moveDayFrame?.startDate 
      ? Math.ceil((moveDayFrame.startDate.toDate().getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Calculate schedule adherence
    let onScheduleCount = 0
    let behindScheduleCount = 0
    let aheadOfScheduleCount = 0

    for (const frame of frames) {
      if (!frame.endDate || frame.taskCount === 0) continue
      
      const frameEndDate = frame.endDate.toDate()
      const frameCompletion = frame.completedCount / frame.taskCount
      
      if (today > frameEndDate) {
        // Frame deadline has passed
        if (frameCompletion === 1) {
          onScheduleCount++
        } else {
          behindScheduleCount++
        }
      } else if (frameCompletion === 1) {
        // Frame completed before deadline
        aheadOfScheduleCount++
      } else {
        // Frame is in progress and on time
        onScheduleCount++
      }
    }

    const totalScheduleItems = onScheduleCount + behindScheduleCount + aheadOfScheduleCount
    const onSchedulePercentage = totalScheduleItems > 0 
      ? (onScheduleCount / totalScheduleItems) * 100 
      : 100

    return {
      totalFrames,
      activeFrames,
      completedFrames,
      currentPhase,
      daysUntilMove,
      onSchedulePercentage,
      behindScheduleCount,
      aheadOfScheduleCount
    }
  }

  /**
   * Calculate activity-based statistics
   */
  private static async calculateActivityStats(activities: FirebasePlannerActivity[]): Promise<PlannerAnalytics['activityStats']> {
    const totalActions = activities.length

    // Group activities by date
    const dailyActivity = activities.reduce((acc, activity) => {
      const date = activity.createdAt.toDate().toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Group activities by week
    const weeklyActivity = activities.reduce((acc, activity) => {
      const date = activity.createdAt.toDate()
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      acc[weekKey] = (acc[weekKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Find most active users
    const userActivity = activities.reduce((acc, activity) => {
      if (activity.userId && activity.userId !== 'system') {
        acc[activity.userId] = acc[activity.userId] || { count: 0, name: activity.userName || 'Unknown' }
        acc[activity.userId].count++
      }
      return acc
    }, {} as Record<string, { count: number, name: string }>)

    const mostActiveUsers = Object.entries(userActivity)
      .map(([userId, data]) => ({ userId, userName: data.name, actionCount: data.count }))
      .sort((a, b) => b.actionCount - a.actionCount)
      .slice(0, 10)

    // Calculate peak activity hours
    const hourlyActivity = new Array(24).fill(0)
    activities.forEach(activity => {
      const hour = activity.createdAt.toDate().getHours()
      hourlyActivity[hour]++
    })
    const peakActivityHours = hourlyActivity
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour)

    return {
      totalActions,
      dailyActivity,
      weeklyActivity,
      mostActiveUsers,
      peakActivityHours
    }
  }

  /**
   * Calculate performance metrics
   */
  private static async calculatePerformanceStats(
    tasks: FirebasePlannerTask[],
    frames: FirebasePlannerFrame[],
    activities: FirebasePlannerActivity[]
  ): Promise<PlannerAnalytics['performanceStats']> {
    const averageTasksPerFrame = frames.length > 0 
      ? tasks.length / frames.length 
      : 0

    // Calculate unique users from activities
    const uniqueUsers = new Set(activities.map(a => a.userId).filter(id => id !== 'system')).size
    const averageTasksPerUser = uniqueUsers > 0 ? tasks.length / uniqueUsers : 0

    // Collaboration score based on multi-user interactions
    const collaborativeActions = activities.filter(a => 
      ['task_assigned', 'comment_added', 'task_moved', 'task_updated'].includes(a.type) &&
      a.userId !== 'system'
    ).length
    const collaborationScore = Math.min(100, (collaborativeActions / Math.max(1, tasks.length)) * 50)

    // Efficiency score based on completion rate and timeline adherence
    const completedTasks = tasks.filter(t => t.completed).length
    const completionRate = tasks.length > 0 ? completedTasks / tasks.length : 0
    const onTimeCompletion = frames.filter(f => f.completedCount === f.taskCount && f.taskCount > 0).length
    const timelineAdherence = frames.length > 0 ? onTimeCompletion / frames.length : 0
    const efficiencyScore = Math.round((completionRate * 0.7 + timelineAdherence * 0.3) * 100)

    // Planner usage score based on feature utilization
    const featureUsageScore = Math.min(100, (activities.length / Math.max(1, tasks.length)) * 20)

    return {
      averageTasksPerFrame,
      averageTasksPerUser,
      collaborationScore: Math.round(collaborationScore),
      efficiencyScore,
      plannerUsageScore: Math.round(featureUsageScore)
    }
  }

  /**
   * Generate predictions and recommendations
   */
  private static async generatePredictions(
    tasks: FirebasePlannerTask[],
    frames: FirebasePlannerFrame[],
    activities: FirebasePlannerActivity[]
  ): Promise<PlannerAnalytics['predictions']> {
    // Calculate estimated completion date based on current pace
    const completedTasks = tasks.filter(t => t.completed).length
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0
    
    // Get recent activity to determine pace
    const recentActivities = activities.filter(a => 
      Date.now() - a.createdAt.toDate().getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    )
    const completionActivities = recentActivities.filter(a => a.type === 'task_completed').length
    const weeklyCompletionPace = completionActivities

    const remainingTasks = totalTasks - completedTasks
    const weeksToCompletion = weeklyCompletionPace > 0 ? remainingTasks / weeklyCompletionPace : 0
    const estimatedCompletionDate = new Date(Date.now() + weeksToCompletion * 7 * 24 * 60 * 60 * 1000)

    // Risk assessment based on various factors
    let riskScore = 0
    
    // Factor 1: Completion rate
    if (completionRate < 0.3) riskScore += 3
    else if (completionRate < 0.6) riskScore += 1
    
    // Factor 2: Timeline adherence
    const overdueTasks = tasks.filter(t => 
      !t.completed && 
      t.dueDate && 
      t.dueDate.toDate() < new Date()
    ).length
    if (overdueTasks > totalTasks * 0.2) riskScore += 3
    else if (overdueTasks > totalTasks * 0.1) riskScore += 1
    
    // Factor 3: Activity level
    if (recentActivities.length < totalTasks * 0.1) riskScore += 2
    
    const riskAssessment = riskScore >= 5 ? 'high' : riskScore >= 2 ? 'medium' : 'low'

    // Generate recommendations
    const recommendedActions: string[] = []
    
    if (completionRate < 0.5) {
      recommendedActions.push('Focus on completing high-priority tasks to improve overall progress')
    }
    
    if (overdueTasks > 0) {
      recommendedActions.push(`Review and reschedule ${overdueTasks} overdue tasks`)
    }
    
    if (weeklyCompletionPace < 2) {
      recommendedActions.push('Consider increasing task completion frequency or breaking down large tasks')
    }
    
    if (recentActivities.length < 5) {
      recommendedActions.push('Increase team engagement and task activity')
    }

    // Identify bottlenecks
    const bottlenecks = frames
      .filter(frame => {
        const frameCompletionRate = frame.taskCount > 0 ? frame.completedCount / frame.taskCount : 1
        const isOverdue = frame.endDate && frame.endDate.toDate() < new Date()
        return frameCompletionRate < 0.8 && isOverdue
      })
      .map(frame => ({
        frameId: frame.id,
        frameName: frame.title,
        reason: `${frame.completedCount}/${frame.taskCount} tasks completed, deadline passed`
      }))

    return {
      estimatedCompletionDate,
      riskAssessment,
      recommendedActions,
      bottlenecks
    }
  }

  // ===============================================
  // Data Fetching Helpers
  // ===============================================

  private static async getTasks(moveId: string): Promise<FirebasePlannerTask[]> {
    const tasksRef = collection(db, `moves/${moveId}/plannerTasks`)
    const snapshot = await getDocs(tasksRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePlannerTask))
  }

  private static async getFrames(moveId: string): Promise<FirebasePlannerFrame[]> {
    const framesRef = collection(db, `moves/${moveId}/plannerFrames`)
    const snapshot = await getDocs(framesRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePlannerFrame))
  }

  private static async getRecentActivity(moveId: string, days: number = 30): Promise<FirebasePlannerActivity[]> {
    const cutoffDate = Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000))
    const activitiesRef = collection(db, `moves/${moveId}/plannerActivity`)
    const q = query(
      activitiesRef,
      where('createdAt', '>=', cutoffDate),
      orderBy('createdAt', 'desc'),
      limit(1000)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebasePlannerActivity))
  }

  // ===============================================
  // Analytics Storage and Export
  // ===============================================

  /**
   * Store analytics snapshot for historical tracking
   */
  private static async storeAnalyticsSnapshot(moveId: string, analytics: PlannerAnalytics): Promise<void> {
    const snapshotDoc = doc(collection(db, `moves/${moveId}/analyticsSnapshots`))
    await setDoc(snapshotDoc, {
      ...analytics,
      snapshotId: snapshotDoc.id
    })
  }

  /**
   * Get historical analytics snapshots
   */
  static async getAnalyticsHistory(
    moveId: string,
    limit: number = 30
  ): Promise<PlannerAnalytics[]> {
    const snapshotsRef = collection(db, `moves/${moveId}/analyticsSnapshots`)
    const q = query(
      snapshotsRef,
      orderBy('generatedAt', 'desc'),
      limit(limit)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as PlannerAnalytics)
  }

  // ===============================================
  // Real-time Event Tracking
  // ===============================================

  /**
   * Track planner events for analytics
   */
  static trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    try {
      logEvent(this.analytics, `planner_${eventName}`, {
        ...parameters,
        timestamp: Date.now()
      })
    } catch (error) {
      console.warn('Failed to track analytics event:', error)
    }
  }

  /**
   * Track task completion
   */
  static trackTaskCompletion(moveId: string, taskId: string, userId: string, completionTime: number): void {
    this.trackEvent('task_completed', {
      move_id: moveId,
      task_id: taskId,
      user_id: userId,
      completion_time_hours: completionTime
    })
  }

  /**
   * Track feature usage
   */
  static trackFeatureUsage(feature: string, moveId: string, userId: string, metadata?: Record<string, any>): void {
    this.trackEvent('feature_used', {
      feature,
      move_id: moveId,
      user_id: userId,
      ...metadata
    })
  }

  /**
   * Track performance metrics
   */
  static trackPerformance(operation: string, duration: number, success: boolean): void {
    this.trackEvent('performance_metric', {
      operation,
      duration_ms: duration,
      success
    })
  }

  // ===============================================
  // Insights and Recommendations Engine
  // ===============================================

  /**
   * Generate personalized insights for a move
   */
  static async generateInsights(moveId: string): Promise<{
    insights: Array<{
      type: 'success' | 'warning' | 'info' | 'suggestion'
      title: string
      message: string
      actionable: boolean
      action?: string
    }>
  }> {
    const analytics = await this.generatePlannerAnalytics(moveId)
    const insights = []

    // Completion rate insights
    if (analytics.taskStats.completionRate > 80) {
      insights.push({
        type: 'success',
        title: 'Great Progress!',
        message: `You've completed ${analytics.taskStats.completionRate.toFixed(1)}% of your tasks. Keep up the excellent work!`,
        actionable: false
      })
    } else if (analytics.taskStats.completionRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Behind Schedule',
        message: `Only ${analytics.taskStats.completionRate.toFixed(1)}% of tasks completed. Consider focusing on high-priority items.`,
        actionable: true,
        action: 'Review high-priority tasks'
      })
    }

    // Timeline adherence insights
    if (analytics.timelineStats.behindScheduleCount > 0) {
      insights.push({
        type: 'warning',
        title: 'Timeline Delays',
        message: `${analytics.timelineStats.behindScheduleCount} timeline phases are behind schedule.`,
        actionable: true,
        action: 'Review delayed phases'
      })
    }

    // Collaboration insights
    if (analytics.performanceStats.collaborationScore < 30) {
      insights.push({
        type: 'suggestion',
        title: 'Increase Collaboration',
        message: 'Consider assigning tasks to team members and using comments for better coordination.',
        actionable: true,
        action: 'Assign tasks to team members'
      })
    }

    // Risk assessment insights
    if (analytics.predictions.riskAssessment === 'high') {
      insights.push({
        type: 'warning',
        title: 'High Risk Detected',
        message: 'Your move is at high risk of delays. Immediate action recommended.',
        actionable: true,
        action: 'Review risk factors'
      })
    }

    return { insights }
  }
}