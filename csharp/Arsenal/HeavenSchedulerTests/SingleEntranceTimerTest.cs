using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HeavenRepo.Scheduler;
using NUnit.Framework;

namespace HeavenSchedulerTests
{
    [TestFixture]
    public class SingleEntranceTimerTest
    {
        class DataBag
        {
            public bool Cancelled { get; set; } = false;
            private int numRun = 0;
            public int NumRun => numRun;

            public void RunUntilCancelled()
            {
                if (Cancelled)
                    return;
                Interlocked.Increment(ref numRun);
                while (!Cancelled)
                {
                    Thread.Sleep(TimeSpan.FromMilliseconds(10));
                }
            }

            public void RunIfNotCancelled()
            {
                if (Cancelled)
                    return;
                Interlocked.Increment(ref numRun);
            }
        }

        [Test]
        public void Test_SingleEntranceTimer_OnlyOneRunningInstance()
        {
            int parallism = 3;
            DataBag db = new DataBag();
            Action action = db.RunUntilCancelled;
            SingleEntranceTimer timer = new SingleEntranceTimer(action, TimeSpan.FromMilliseconds(2));
            Assert.IsFalse(timer.Started);
            List<Task> tasks = Enumerable.Range(0, parallism).Select(i => timer.ForceFire()).ToList();

            SpinWait spinWait = new SpinWait();
            while (timer.NumFired < parallism || db.NumRun == 0)
            {
                spinWait.SpinOnce();
            }
            db.Cancelled = true;

            Task.WhenAll(tasks).Wait();

            Assert.AreEqual(1, db.NumRun);
            Assert.AreEqual(1, timer.NumExecuted);
            Assert.AreEqual(parallism, timer.NumFired);
            timer.Dispose();
        }

        [Test]
        public void Test_SingleEntranceTimer_MaxRunTimeLimitation()
        {
            int parallism = 10;
            int runLimit = 3;
            DataBag db = new DataBag();
            Action action = db.RunIfNotCancelled;
            SingleEntranceTimer timer = new SingleEntranceTimer(action, TimeSpan.FromMilliseconds(2), maxExecutionLimit: runLimit);
            Assert.IsFalse(timer.Started);
            for (int i=0;i<parallism;i++)
            {
                timer.ForceFire().Wait();
            }
            
            db.Cancelled = true;
                        
            Assert.AreEqual(runLimit, db.NumRun);
            Assert.AreEqual(runLimit, timer.NumExecuted);
            Assert.AreEqual(parallism, timer.NumFired);
            timer.Dispose();
        }

        [Test]
        public void Test_SingleEntranceTimer_AutoStart()
        {
            DataBag db = new DataBag();
            Action action = db.RunIfNotCancelled;
            SingleEntranceTimer timer = new SingleEntranceTimer(action, TimeSpan.FromMilliseconds(2), autoStart:true);
            Assert.IsTrue(timer.Started);
            timer.Dispose();
        }
    }
}
