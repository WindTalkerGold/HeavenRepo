using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace MultiThread
{
    public class ConcurrentProducer<T>
    {
        public ConcurrentQueue<T> Buffer { get; set; }
        public bool StopProduceNew { get; set; }

        public bool Stopped => StopProduceNew && Buffer.IsEmpty;
    }
}
