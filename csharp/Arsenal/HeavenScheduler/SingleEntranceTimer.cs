using System;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;

using Timer = System.Timers.Timer;
namespace Scheduling
{
    /// <summary>
    /// A timer that allows at most one running instance to the action
    /// Public methods of this class are not supposed to be invoked in multi thread context.
    /// On each elasped, if the previous run is still not terminated yet, the new run will be skipped
    /// </summary>
    public class SingleEntranceTimer : IDisposable
    {
        private readonly Action action;
        private readonly int maxExecutionLimit;
        Timer timer;

        volatile bool isRunning = false;
        private object locker = new object();

        public bool Started => timer.Enabled;
        
        public int NumExecuted { get; private set; }

        private int numFired = 0;
        public int NumFired => numFired;

        public SingleEntranceTimer(Action action, TimeSpan interval, bool autoStart = false, int maxExecutionLimit = -1)
        {
            if (interval < TimeSpan.FromMilliseconds(1))
                throw new ArgumentException("Must specify an interval at least 1 ms for the timer!");
            this.action = action ?? throw new ArgumentNullException(nameof(action));

            this.maxExecutionLimit = maxExecutionLimit;
            timer = new Timer(interval.TotalMilliseconds);
            timer.Elapsed += Execute;

            if (autoStart)
                Start();
        }
        
        public void Start()
        {
            timer.Enabled = true;
        }

        public void Stop()
        {
            timer.Enabled = false;
        }

        public void Dispose()
        {
            timer.Dispose();
        }

        public Task ForceFire()
        {
            return Task.Run(() => Execute(null, null));
        }


        private void Execute(object source, ElapsedEventArgs args)
        {
            Interlocked.Increment(ref numFired);

            if (maxExecutionLimit != -1 && NumExecuted >= maxExecutionLimit)
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

            NumExecuted++;
            action();
            isRunning = false;
        }
    }
}
