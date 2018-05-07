using System.Threading.Tasks;

namespace MultiThread.Throttle
{
    public interface IThrottleController
    {
        /// <summary>
        /// Queue a process to be processed
        /// </summary>
        /// <returns>true if queued successfully, false if exceeded the limitation</returns>
        bool QueueProcess(IThrottableProcess process);

        /// <summary>
        /// Start allocating quotas
        /// </summary>
        void Start();

        /// <summary>
        /// Stop allocating quotas and dispose after all queued processes finishes
        /// </summary>
        void Shutdown();
    }
}
