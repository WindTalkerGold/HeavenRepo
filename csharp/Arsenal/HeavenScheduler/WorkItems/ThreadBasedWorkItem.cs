using System;
using System.Threading;
using System.Threading.Tasks;

namespace HeavenRepo.Scheduler
{
    public abstract class ThreadBasedWorkItem : IWorkItem
    {
        protected readonly WorkItemProgress progress = new WorkItemProgress();
        CancellationTokenSource source;

        private Task task;
        public DateTimeOffset StartedTime { get; private set; }

        public void Dispose()
        {
            if (!IsCurrentTaskRunning())
                return;
            source.Cancel();
        }

        public IWorkItemProgress GetCurrentProgress() => progress;

        public IWorkItem GetNext()
        {
            throw new NotImplementedException();
        }

        public bool Start()
        {
            Console.WriteLine("555");

            string message;
            if (!Validate(out message))
            {
                progress.LastUpdatedTime = DateTimeOffset.UtcNow;
                progress.Message = message;
                progress.Progress = Progress.Failed;
                return false;
            }

            source = new CancellationTokenSource();
            task = Task.Run((Action)Execution, source.Token);

            StartedTime = DateTimeOffset.UtcNow;
            progress.LastUpdatedTime = StartedTime;
            progress.Progress = Progress.Running;

            return true;
        }

        protected void FinishProcess()
        {
            progress.LastUpdatedTime = DateTimeOffset.UtcNow;
            progress.Progress = Progress.Completed;
        }

        protected bool IsStarted() => progress.Progress != Progress.NotStarted;

        protected bool IsCurrentTaskRunning()
        {
            if (task == null)
                return false;
            if (task.IsCanceled || task.IsCompleted || task.IsFaulted)
                return false;
            return true;
        }

        abstract protected bool Validate(out string message);
        protected void Execution()
        {
            // the cancellation does not work yet
            ExecutionImpl();
        }

        protected abstract void ExecutionImpl();
    }
}
