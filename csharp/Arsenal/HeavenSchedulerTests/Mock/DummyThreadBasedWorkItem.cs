using System;
using System.Threading;
using HeavenRepo.Scheduler;

namespace HeavenSchedulerTests.Mock
{
    public class DummyThreadBasedWorkItem : ThreadBasedWorkItem
    {
        public bool StartSucc { get; set; } = true;
        public bool FinishSucc { get; set; } = true;
        public string Message { get; set; } = null;
        
        private readonly AutoResetEvent evt;

        public DummyThreadBasedWorkItem(AutoResetEvent evt)
        {
            this.evt = evt;
        }

        protected override void ExecutionImpl()
        {
            if (evt.WaitOne(timeout: TimeSpan.FromSeconds(10)))
            {
                this.progress.LastUpdatedTime = DateTimeOffset.UtcNow;
                this.progress.Message = Message;
                this.progress.Progress = FinishSucc ? Progress.Completed : Progress.Failed;
                Console.WriteLine("Finished with message: " + Message);
                return;
            }

            this.progress.Message = "Not receive signal for 1 minute";
            Console.WriteLine(this.progress.Message);
            this.progress.LastUpdatedTime = DateTimeOffset.UtcNow;
            this.progress.Progress = Progress.Failed;
        }

        protected override bool Validate(out string message)
        {
            message = this.Message;
            return StartSucc;
        }
    }
}
