using HeavenRepo.Scheduler;
namespace HeavenSchedulerTests.Mock
{
    /// <summary>
    /// dummy logger, nothing to do
    /// </summary>
    class DummyLogger : ILogger
    {
        public int AddLogged { get; private set; } = 0;
        public int CompletedLogged { get; private set; } = 0;
        public int FailedLogged { get; private set; } = 0;

        public void Flush()
        {
        }

        public void LogNewWorkItemAdded(IWorkItem newWorkItem)
        {
            AddLogged++;
        }

        public void LogWorkItemComplete(IWorkItem completedWorkItem)
        {
            CompletedLogged++;
        }

        public void LogWorkItemFailed(IWorkItem completedWorkItem)
        {
            FailedLogged++;
        }
    }
}
