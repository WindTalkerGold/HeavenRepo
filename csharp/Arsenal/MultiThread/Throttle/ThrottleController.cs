using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Timers;
using System.Threading;
using System.Threading.Tasks;
using Timer = System.Timers.Timer;

namespace MultiThread.Throttle
{
    public class ThrottleController : IThrottleController
    {
        private readonly IThrottleConfig quotaConfig;
        private ConcurrentQueue<IThrottableProcess>[] processes;
        private ConcurrentQueue<Token>[] tokens;
        private Timer timer;

        private volatile bool isRunning = false;

        public ThrottleController(IThrottleConfig config)
        {
            this.quotaConfig = config;
        }

        public bool QueueProcess(IThrottableProcess process)
        {
            if (!isRunning)
                return false;

            int quotaId = process.GetQuotaId();
            int quota = quotaConfig.GetQuota(quotaId);
            // no quota assigned
            if (quota <= 0)
                return false;
            ConcurrentQueue<IThrottableProcess> queue = this.processes[quotaId];
            // exceeded quota * rejectionFactor, reject for too many processes queued
            if (queue.Count >= quota * quotaConfig.RejectionFactor)
                return false;

            queue.Enqueue(process);
            return true;
        }

        public void Shutdown()
        {
            isRunning = false;
        }

        public void Start()
        {
            this.processes = Enumerable.Range(0, quotaConfig.QuotaIdsCount)
                                       .Select(_ => new ConcurrentQueue<IThrottableProcess>())
                                       .ToArray();
            this.tokens = Enumerable.Range(0, quotaConfig.QuotaIdsCount)
                                    .Select(_ => new ConcurrentQueue<Token>())
                                    .ToArray();

            RegisterQuotaAllocationTimer();

            isRunning = true;
            Task.Run((Action)SpinWhileRunning);
        }

        private void RegisterQuotaAllocationTimer()
        {
            timer = new Timer()
            {
                Interval = TimeSpan.FromSeconds(1).TotalMilliseconds,
                Enabled = true
            };
            timer.Elapsed += (obj, stat) =>
            {
                for (int quotaId = 0; quotaId < quotaConfig.QuotaIdsCount; quotaId++)
                {
                    ConcurrentQueue<Token> tokenThisId = tokens[quotaId];
                    Token token;
                    while (tokenThisId.TryPeek(out token))
                    {
                        if (!token.HasExpired())
                            break;
                        if (!tokenThisId.TryDequeue(out token))
                            break;
                    }

                    int quota = quotaConfig.GetQuota(quotaId);
                    for (int i = 0; i < quota; i++)
                    {
                        tokenThisId.Enqueue(new Token() { Expiration = DateTimeOffset.UtcNow + quotaConfig.TokenExpiration });
                    }
                }
            };

            timer.Start();
        }

        private void SpinWhileRunning()
        {
            while (isRunning || !this.processes.All(queue=>queue.IsEmpty))
            {
                //bool shouldYieldCpu = false;
                for (int quotaId =0;quotaId<this.quotaConfig.QuotaIdsCount;quotaId++)
                {
                    var processPool = this.processes[quotaId];
                    IThrottableProcess process;
                    // no process queued
                    if (!processPool.TryPeek(out process))
                    {
                        //shouldYieldCpu = true;
                        continue;
                    }

                    Token token;
                    var tokenQueue = this.tokens[quotaId];
                    // no tokens avaliable now
                    if (!this.tokens[quotaId].TryPeek(out token))
                    {
                        //shouldYieldCpu = true;
                        continue;
                    }

                    if (!processPool.TryDequeue(out process) || !tokenQueue.TryDequeue(out token))
                    {
                        // should happend
                        continue;
                    }

                    process.Execute();
                }

                //if(shouldYieldCpu)
                 //   Thread.Yield();
                
            }
        }
    }
}
