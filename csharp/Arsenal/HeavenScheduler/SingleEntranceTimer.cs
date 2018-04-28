using System;
using System.Threading;

namespace Scheduling
{
    public class SingleEntranceTimer : IDisposable
    {
        bool started;
        private readonly Action<object> action;
        private readonly int maxExecutionLimit;
        int executedTimes = 0;
        Timer timer;

        volatile bool isRunning = false;
        private object locker = new object();
        
        public SingleEntranceTimer(Action<object> action, TimeSpan interval, bool autoStart = false, int maxExecutionLimit = -1)
        {
            this.started = autoStart;
            this.maxExecutionLimit = maxExecutionLimit;

            this.action = action;

            timer = new Timer(null, null, TimeSpan.Zero, interval);
                        
            if (autoStart)
                Start();
        }
        
        public void Start()
        {
            if (started)
                return;

            started = true;
        }

        public void Stop()
        {
            if (!started)
                return;

            started = false;
        }

        public void Dispose()
        {
            timer.Dispose();
        }

        private void Execute(object obj)
        {
            if (maxExecutionLimit != -1 && executedTimes >= maxExecutionLimit)
            {
                Stop();
                return;
            }

            if (isRunning)
                return;

            lock (locker)
            {
                if (isRunning)
                    return;

                isRunning = true;
                action(obj);
                isRunning = false;
                executedTimes++;
            }
        }
    }
}
