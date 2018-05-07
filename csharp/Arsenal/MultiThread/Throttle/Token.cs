using System;

namespace MultiThread.Throttle
{
    internal struct Token
    {
        public DateTimeOffset Expiration { get; set; }
        
        public bool HasExpired() => Expiration <= DateTimeOffset.UtcNow;
    }
}
