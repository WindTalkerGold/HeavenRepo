using System;

namespace Scheduling
{
    public enum Progress
    {
        NotStarted,
        Running,
        Completed,
        Failed
    }

    public interface IWorkItemProgress
    {
        Progress Progress { get; }

        DateTimeOffset LastUpdatedTime { get; }

        string Message { get; }
    }

    public class WorkItemProgress : IWorkItemProgress
    {
        public Progress Progress { get; set; }

        public DateTimeOffset LastUpdatedTime { get; set; }

        public string Message {get;set;}
    }
}
