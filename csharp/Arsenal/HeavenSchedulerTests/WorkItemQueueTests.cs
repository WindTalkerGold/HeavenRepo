using Scheduling;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using HeavenSchedulerTests.Mock;

namespace HeavenSchedulerTests
{
    [TestClass]
    public class WorkItemQueueTests
    {
        [TestMethod]
        public void Test_RefreshWorkItemStatus_UntilComplete()
        {
            DummyLogger mockedLogger = new DummyLogger();
            WorkItemQueue queue = new WorkItemQueue(10, mockedLogger);

            WorkItemProgress progress = new WorkItemProgress();
            LookupWorkItem workItem = new LookupWorkItem(progress);

            progress.Progress = Progress.NotStarted;

            queue.AddWorkItem(workItem);
            Assert.AreEqual(1, queue.PendingItemsNum);
            Assert.AreEqual(1, mockedLogger.AddLogged);
            
            queue.Refresh();
            Assert.AreEqual(Progress.Running, progress.Progress);
            Assert.AreEqual(0, queue.PendingItemsNum);
            Assert.AreEqual(1, queue.ActiveItemsNum);
            Assert.AreEqual(1, queue.RunningItemsNum);

            queue.Refresh();
            queue.Refresh();
            Assert.AreEqual(0, queue.PendingItemsNum);
            Assert.AreEqual(1, queue.ActiveItemsNum);
            Assert.AreEqual(1, queue.RunningItemsNum);
            Assert.AreEqual(0, mockedLogger.CompletedLogged);

            progress.Progress = Progress.Completed;
            queue.Refresh();
            Assert.AreEqual(0, queue.ActiveItemsNum);
            Assert.AreEqual(1, mockedLogger.CompletedLogged);
        }

        [TestMethod]
        public void Test_RefreshWorkItemStatus_UntilFail()
        {
            DummyLogger mockedLogger = new DummyLogger();
            WorkItemQueue queue = new WorkItemQueue(10, mockedLogger);

            WorkItemProgress progress = new WorkItemProgress();
            LookupWorkItem workItem = new LookupWorkItem(progress);

            progress.Progress = Progress.NotStarted;

            queue.AddWorkItem(workItem);
            Assert.AreEqual(1, queue.PendingItemsNum);
            Assert.AreEqual(1, mockedLogger.AddLogged);

            queue.Refresh();
            Assert.AreEqual(Progress.Running, progress.Progress);
            Assert.AreEqual(0, queue.PendingItemsNum);
            Assert.AreEqual(1, queue.ActiveItemsNum);
            Assert.AreEqual(1, queue.RunningItemsNum);

            queue.Refresh();
            queue.Refresh();
            Assert.AreEqual(0, queue.PendingItemsNum);
            Assert.AreEqual(1, queue.ActiveItemsNum);
            Assert.AreEqual(1, queue.RunningItemsNum);
            Assert.AreEqual(0, mockedLogger.CompletedLogged);

            progress.Progress = Progress.Failed;
            queue.Refresh();
            Assert.AreEqual(0, queue.ActiveItemsNum);
            Assert.AreEqual(0, mockedLogger.CompletedLogged);
            Assert.AreEqual(1, mockedLogger.FailedLogged);
        }

        [TestMethod]
        public void Test_RefreshWorkItemStatus_FailToStart()
        {
            DummyLogger mockedLogger = new DummyLogger();
            WorkItemQueue queue = new WorkItemQueue(10, mockedLogger);

            WorkItemProgress progress = new WorkItemProgress();
            LookupWorkItem workItem = new LookupWorkItem(progress);

            progress.Progress = Progress.Failed;

            queue.AddWorkItem(workItem);
            Assert.AreEqual(1, queue.PendingItemsNum);
            Assert.AreEqual(1, mockedLogger.AddLogged);

            queue.Refresh();
            Assert.AreEqual(Progress.Failed, progress.Progress);
            Assert.AreEqual(0, queue.ActiveItemsNum);
            Assert.AreEqual(1, mockedLogger.FailedLogged);
        }
    }
}
