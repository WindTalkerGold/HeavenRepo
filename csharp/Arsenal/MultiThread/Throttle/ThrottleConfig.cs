using System;
using System.Collections.Generic;

namespace MultiThread.Throttle
{
    public interface IThrottleConfig
    {
        /// <summary>
        /// total number of different quota ids
        /// </summary>
        /// <returns></returns>
        int QuotaIdsCount { get; }

        /// <summary>
        /// get the quota (throughput per second) for this given id
        /// </summary>
        /// <param name="quotaId"></param>
        /// <returns>positive integer if id is valid, 0 otherwise</returns>
        int GetQuota(int quotaId);

        /// <summary>
        /// Get the factor to reject queuing new items
        /// if k is the value, queue new item will be rejected if there are more than 
        /// k * quota processes queued
        /// </summary>
        int RejectionFactor { get; }

        /// <summary>
        /// Expiration for each allocated tokens
        /// </summary>
        TimeSpan TokenExpiration { get; }
    }

    public class ThrottleConfig : IThrottleConfig
    {
        private readonly IReadOnlyList<int> quotas;

        public ThrottleConfig(IReadOnlyList<int> quotas)
        {
            this.quotas = quotas;
        }

        public int GetQuota(int quotaId)
        {
            if (quotaId >= 0 && quotaId < this.quotas.Count)
                return this.quotas[quotaId];
            return 0;
        }

        public int QuotaIdsCount => this.quotas.Count;

        public int RejectionFactor { get; set; }

        public TimeSpan TokenExpiration { get; set; }
    }
}
