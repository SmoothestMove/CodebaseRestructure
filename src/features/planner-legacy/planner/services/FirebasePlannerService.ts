import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { firestore as db } from '@/main';
import { PlannerTask, TimeframeColumn, PlannerState } from '../types';

export class FirebasePlannerService {
  // Collection references
  private static getTasksCollection(moveId: string) {
    return collection(db, 'moves', moveId, 'plannerTasks');
  }

  private static getTimeframesCollection(moveId: string) {
    return collection(db, 'moves', moveId, 'plannerTimeframes');
  }

  private static getPlannerConfigDoc(moveId: string) {
    return doc(db, 'moves', moveId, 'plannerConfig', 'settings');
  }

  // Real-time listeners
  static subscribeToTasks(moveId: string, callback: (tasks: Record<string, PlannerTask>) => void): Unsubscribe {
    const tasksCollection = this.getTasksCollection(moveId);
    
    return onSnapshot(tasksCollection, (snapshot) => {
      const tasks: Record<string, PlannerTask> = {};
      snapshot.docs.forEach(doc => {
        tasks[doc.id] = { id: doc.id, ...doc.data() } as PlannerTask;
      });
      callback(tasks);
    }, (error) => {
      console.error('Error listening to planner tasks:', error);
    });
  }

  static subscribeToTimeframes(moveId: string, callback: (timeframes: Record<string, TimeframeColumn>, order: string[]) => void): Unsubscribe {
    const timeframesCollection = this.getTimeframesCollection(moveId);
    
    return onSnapshot(timeframesCollection, (snapshot) => {
      const timeframes: Record<string, TimeframeColumn> = {};
      snapshot.docs.forEach(doc => {
        timeframes[doc.id] = { id: doc.id, ...doc.data() } as TimeframeColumn;
      });
      
      // Sort timeframes by order
      const order = Object.values(timeframes)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(tf => tf.id);
      
      callback(timeframes, order);
    }, (error) => {
      console.error('Error listening to planner timeframes:', error);
    });
  }

  static subscribeToConfig(moveId: string, callback: (config: { sidebarCollapsed: boolean }) => void): Unsubscribe {
    const configDoc = this.getPlannerConfigDoc(moveId);
    
    return onSnapshot(configDoc, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as { sidebarCollapsed: boolean });
      } else {
        // Initialize with default config
        callback({ sidebarCollapsed: false });
      }
    }, (error) => {
      console.error('Error listening to planner config:', error);
    });
  }

  // Task operations
  static async saveTask(moveId: string, task: PlannerTask): Promise<void> {
    const taskDoc = doc(this.getTasksCollection(moveId), task.id);
    await setDoc(taskDoc, {
      ...task,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  static async saveTasks(moveId: string, tasks: PlannerTask[]): Promise<void> {
    const batch = writeBatch(db);
    const tasksCollection = this.getTasksCollection(moveId);

    tasks.forEach(task => {
      const taskDoc = doc(tasksCollection, task.id);
      batch.set(taskDoc, {
        ...task,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });

    await batch.commit();
  }

  static async deleteTask(moveId: string, taskId: string): Promise<void> {
    const taskDoc = doc(this.getTasksCollection(moveId), taskId);
    await deleteDoc(taskDoc);
  }

  // Timeframe operations
  static async saveTimeframe(moveId: string, timeframe: TimeframeColumn): Promise<void> {
    const timeframeDoc = doc(this.getTimeframesCollection(moveId), timeframe.id);
    await setDoc(timeframeDoc, {
      ...timeframe,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  static async deleteTimeframe(moveId: string, timeframeId: string): Promise<void> {
    const timeframeDoc = doc(this.getTimeframesCollection(moveId), timeframeId);
    await deleteDoc(timeframeDoc);
  }

  // Bulk operations for drag and drop
  static async updateTaskAssignments(moveId: string, updates: { taskId: string; timeframeId?: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db);
    const tasksCollection = this.getTasksCollection(moveId);
    const timeframesCollection = this.getTimeframesCollection(moveId);

    // Group updates by timeframe to update taskIds arrays efficiently
    const timeframeUpdates: Record<string, string[]> = {};
    
    updates.forEach(update => {
      const taskDoc = doc(tasksCollection, update.taskId);
      batch.update(taskDoc, {
        order: update.order,
        updatedAt: serverTimestamp()
      });

      if (update.timeframeId) {
        if (!timeframeUpdates[update.timeframeId]) {
          timeframeUpdates[update.timeframeId] = [];
        }
        timeframeUpdates[update.timeframeId].push(update.taskId);
      }
    });

    // Update timeframe taskIds
    Object.entries(timeframeUpdates).forEach(([timeframeId, taskIds]) => {
      const timeframeDoc = doc(timeframesCollection, timeframeId);
      batch.update(timeframeDoc, {
        taskIds,
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();
  }

  // Config operations
  static async updateConfig(moveId: string, config: { sidebarCollapsed?: boolean }): Promise<void> {
    const configDoc = this.getPlannerConfigDoc(moveId);
    await setDoc(configDoc, {
      ...config,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  // Initialize planner with default data
  static async initializePlanner(moveId: string, initialTasks: PlannerTask[], initialTimeframes: TimeframeColumn[]): Promise<void> {
    const batch = writeBatch(db);
    
    // Add tasks
    const tasksCollection = this.getTasksCollection(moveId);
    initialTasks.forEach(task => {
      const taskDoc = doc(tasksCollection, task.id);
      batch.set(taskDoc, {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    // Add timeframes
    const timeframesCollection = this.getTimeframesCollection(moveId);
    initialTimeframes.forEach(timeframe => {
      const timeframeDoc = doc(timeframesCollection, timeframe.id);
      batch.set(timeframeDoc, {
        ...timeframe,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    // Add default config
    const configDoc = this.getPlannerConfigDoc(moveId);
    batch.set(configDoc, {
      sidebarCollapsed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
  }

  // Check if planner is already initialized
  static async isPlannerInitialized(moveId: string): Promise<boolean> {
    const tasksCollection = this.getTasksCollection(moveId);
    const snapshot = await getDocs(tasksCollection);
    return !snapshot.empty;
  }
}