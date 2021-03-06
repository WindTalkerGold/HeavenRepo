﻿using System.Linq;
using System.Collections.Generic;
using System.Collections.Concurrent;

namespace HeavenRepo.Scheduler
{
    public class WorkItemQueue
    {
        public WorkItemQueue(int maxItems, ILogger logger)
        {
            this.maxItemsCount = maxItems;
            this.logger = logger;
            this.pendingWorkItems = new ConcurrentQueue<IWorkItem>();
            this.runningWorkItems = new List<IWorkItem>();
        }

        private readonly int maxItemsCount;
        private readonly ILogger logger;
        private readonly ConcurrentQueue<IWorkItem> pendingWorkItems;
        private readonly List<IWorkItem> runningWorkItems;

        private List<IWorkItem> failedWorkItems;

        public bool AddWorkItem(IWorkItem workItem)
        {
            if (ActiveItemsNum >= maxItemsCount)
                return false;

            pendingWorkItems.Enqueue(workItem);
            logger.LogNewWorkItemAdded(workItem);
            return true;
        }

        public int RunningItemsNum => runningWorkItems.Count;

        public int PendingItemsNum => pendingWorkItems.Count;

        public int ActiveItemsNum => RunningItemsNum + PendingItemsNum;

        public void Refresh()
        {
            failedWorkItems = new List<IWorkItem>();
            List<IWorkItem> completedWorkItems = new List<IWorkItem>();

            StartPendingWorkItems();
                        
            foreach (IWorkItem runningWorkItem in runningWorkItems)
            {
                IWorkItemProgress progress = runningWorkItem.GetCurrentProgress();
                switch (progress.Progress)
                {
                    case Progress.Completed:
                        completedWorkItems.Add(runningWorkItem);
                        IWorkItem subsequentialWorkItem = runningWorkItem.GetNext();
                        if(subsequentialWorkItem != null)
                            AddWorkItem(runningWorkItem.GetNext());
                        break;
                    case Progress.Failed:
                    case Progress.NotStarted:   // not started will be considered as failed
                        failedWorkItems.Add(runningWorkItem);
                        break;
                    case Progress.Running:
                        break;
                }
            }

            runningWorkItems.RemoveAll(item => failedWorkItems.Contains(item) || completedWorkItems.Contains(item));
            ProcessFinishedItems(completedWorkItems.Concat(failedWorkItems));
        }

        private void StartPendingWorkItems()
        {
            IWorkItem newItem;
            while (pendingWorkItems.TryDequeue(out newItem))
            {
                if (newItem.Start())
                {
                    runningWorkItems.Add(newItem);
                }
                else
                {
                    failedWorkItems.Add(newItem);
                }
            }
        }

        private void ProcessFinishedItems(IEnumerable<IWorkItem> finishedWorkItems)
        {
            foreach (IWorkItem workItem in finishedWorkItems)
            {
                IWorkItemProgress result = workItem.GetCurrentProgress();
                if (result.Progress == Progress.Completed)
                    logger.LogWorkItemComplete(workItem);
                else
                    logger.LogWorkItemFailed(workItem);
                workItem.Dispose();
            }

            logger.Flush();
        }
    }
}
