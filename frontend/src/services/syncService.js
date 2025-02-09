class SyncService {
  priorities = {
    CRITICAL: 1, // Location data, user settings
    HIGH: 2,     // Recent photos and recordings
    MEDIUM: 3,   // Older content
    LOW: 4       // Archived content
  };

  async syncQueue = [];
  
  async addToQueue(item, priority) {
    this.syncQueue.push({ item, priority, timestamp: Date.now() });
    this.sortQueue();
  }

  async processQueue() {
    while (this.syncQueue.length > 0 && navigator.onLine) {
      const item = this.syncQueue.shift();
      try {
        await this.syncItem(item);
      } catch (error) {
        if (this.isNetworkError(error)) {
          this.syncQueue.unshift(item);
          break;
        }
        // Handle other errors
      }
    }
  }

  async handleConflict(localData, serverData) {
    // Basic conflict resolution strategy
    if (serverData.lastModified > localData.lastModified) {
      return serverData;
    }
    // Add more complex merge strategies here
    return localData;
  }
} 