using System;

namespace Scheduling
{
    /// <summary>
    /// Represent a work item. All methods here should be non blocking.
    /// </summary>
    public interface IWorkItem : IDisposable
    {
        /// <summary>
        /// Check current progress of the work item, should be a simple lookup
        /// </summary>
        /// <returns>current progress</returns>
        IWorkItemProgress GetCurrentProgress();

        /// <summary>
        /// Start the work item. Should be a simple set or start a new thread, etc.
        /// It must be non blocking
        /// </summary>
        /// <returns>true if work item is started and false if failed to start</returns>
        bool Start();

        /// <summary>
        /// Get the possible subsequential work item of the current one
        /// </summary>
        /// <returns>null if no subsequential work item is needed</returns>
        IWorkItem GetNext();

        /// <summary>
        /// Should be set when the work item is started
        /// </summary>
        DateTimeOffset StartedTime { get; }
    }
}
