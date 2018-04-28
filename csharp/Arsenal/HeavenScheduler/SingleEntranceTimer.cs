using System;
using System.Timers;

namespace Scheduling
{
    public class SingleEntranceTimer : IDisposable
    {
        bool started;
        private readonly Action action;
        private readonly int maxExecutionLimit;
        int executedTimes = 0;
        Timer timer;

        volatile bool isRunning = false;
        private object locker = new object();
        
        public SingleEntranceTimer(Action action, TimeSpan interval, bool autoStart = false, int maxExecutionLimit = -1)
        {
            this.started = autoStart;
            this.maxExecutionLimit = maxExecutionLimit;

            this.action = action;

            timer = new Timer();
            timer.Interval = interval.Milliseconds;
            timer.Elapsed += Execute;

            if (autoStart)
                Start();
        }
        
        public void Start()
        {
            if (started)
                return;

            timer.Enabled = true;
            started = true;
        }

        public void Stop()
        {
            if (!started)
                return;

            timer.Enabled = false;
            started = false;
        }

        public void Dispose()
        {
            timer.Dispose();
        }

        private void Execute(object source, ElapsedEventArgs args)
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
            }

            executedTimes++;
            action();
            isRunning = false;
        }
    }
}
