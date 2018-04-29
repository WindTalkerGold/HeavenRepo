using System;

namespace Scheduling
{
    public class LookupWorkItem : IWorkItem
    {
        private readonly WorkItemProgress progressToMonitor;
        private DateTimeOffset startedTime;

        public LookupWorkItem(WorkItemProgress progress)
        {
            if (progress.Progress != Progress.NotStarted && progress.Progress != Progress.Running)
                throw new ArgumentException("The progress to monitor must be in either NotStarted or Running state!");

            this.progressToMonitor = progress;
        }

        public DateTimeOffset StartedTime => startedTime;

        public void Dispose() // nothing to do 
        { }

        public IWorkItemProgress GetCurrentProgress() => progressToMonitor;

        public IWorkItem GetNext() => null;

        public bool Start()
        {
            if(progressToMonitor.Progress == Progress.NotStarted)
                progressToMonitor.Progress = Progress.Running;

            if (progressToMonitor.Progress != Progress.Running)
                return false;

            startedTime = DateTimeOffset.UtcNow;
            return true;
        }
    }
}
