using System.Threading;
using NUnit.Framework;
using HeavenSchedulerTests.Mock;
using HeavenRepo.Scheduler;

namespace HeavenSchedulerTests
{
    [TestFixture]
    public class ThreadBasedWorkItemTests
    {
        [Test]
        public void Test_StartThreadUntilFinish()
        {
            AutoResetEvent evt = new AutoResetEvent(false);
            DummyThreadBasedWorkItem item = new DummyThreadBasedWorkItem(evt);
            Assert.IsTrue(item.Start());
            IWorkItemProgress progress = item.GetCurrentProgress();
            Assert.AreEqual(Progress.Running, progress.Progress);

            evt.Set();
            Thread.Yield();

            SpinWait spinWait = new SpinWait();
            for (int i = 0; i < 10; i++)
            {
                progress = item.GetCurrentProgress();
                if (progress.Progress == Progress.Completed)
                    break;
                spinWait.SpinOnce();
            }
            progress = item.GetCurrentProgress();
            Assert.AreEqual(Progress.Completed, progress.Progress);
        }

        [Test]
        public void Test_StartThread_CompleteFailed()
        {
            AutoResetEvent evt = new AutoResetEvent(false);
            DummyThreadBasedWorkItem item = new DummyThreadBasedWorkItem(evt)
            {
                FinishSucc = false,
                Message = "Job failed"
            };
            Assert.IsTrue(item.Start());
            IWorkItemProgress progress = item.GetCurrentProgress();
            Assert.AreEqual(Progress.Running, progress.Progress);

            evt.Set();
            Thread.Yield();

            SpinWait spinWait = new SpinWait();
            for (int i = 0; i < 30; i++)
            {
                progress = item.GetCurrentProgress();
                if (progress.Progress == Progress.Failed)
                    break;
                spinWait.SpinOnce();
            }
            progress = item.GetCurrentProgress();
            Assert.AreEqual(Progress.Failed, progress.Progress);
            Assert.AreEqual("Job failed", progress.Message);
        }

        [Test]
        public void Test_FailedToStart()
        {
            AutoResetEvent evt = new AutoResetEvent(false);
            DummyThreadBasedWorkItem item = new DummyThreadBasedWorkItem(evt)
            {
                StartSucc = false,
                Message = "Start failed"
            };
            Assert.IsFalse(item.Start());
            IWorkItemProgress progress = item.GetCurrentProgress();
            Assert.AreEqual(Progress.Failed, progress.Progress);
            Assert.AreEqual("Start failed", progress.Message);
        }

        //[Test] cancellation does not work yet
        public void Test_StartThread_CancelLater()
        {
            AutoResetEvent evt = new AutoResetEvent(false);
            DummyThreadBasedWorkItem item = new DummyThreadBasedWorkItem(evt);
            Assert.IsTrue(item.Start());
            IWorkItemProgress progress = item.GetCurrentProgress();
            Assert.AreEqual(Progress.Running, progress.Progress);
            
            Thread.Yield();
            SpinWait spinWait = new SpinWait();
            for (int i = 0; i < 10; i++)
            {
                spinWait.SpinOnce();
            }

            item.Dispose();

            for (int i = 0; i < 10; i++)
            {
                spinWait.SpinOnce();
            }
            progress = item.GetCurrentProgress();
            Thread.Sleep(1000 * 60);
            ///Assert.AreEqual(Progress.Failed, progress.Progress);
        }

    }
}
