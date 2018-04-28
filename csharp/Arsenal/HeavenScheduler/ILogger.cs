
namespace Scheduling
{
    public interface ILogger
    {
        void LogWorkItemComplete(IWorkItem completedWorkItem);

        void LogWorkItemFailed(IWorkItem completedWorkItem);

        void LogNewWorkItemAdded(IWorkItem newWorkItem);

        void Flush();
    }
}
