using System;
using System.Linq;
using System.Threading;

namespace MultiThread
{
    /// <summary>
    /// Use this class to read a file, will separate the file line by line, do specfied action
    /// </summary>
    public class ConcurrentExecuter<T>
    {
        private readonly Action<T> actionOnEach;
        private readonly int parallism;

        public ConcurrentExecuter(Action<T> actionOnEach, int parallism)
        {
            if (actionOnEach == null || parallism <= 1)
                throw new ArgumentException("Must provide valid action and parallism ( >= 2)");

            this.actionOnEach = actionOnEach;
            this.parallism = parallism;            
        }

        public long Execute(ConcurrentProducer<T> itemProducer)
        {
            int[] threadLocals = Enumerable.Repeat(0, parallism).ToArray();

            for (int i = 0; i < parallism; i++)
            {
                ThreadPool.QueueUserWorkItem(status => 
                {
                    while (true)
                    {
                        if (itemProducer.Stopped)
                            break;
                        T item;
                        if (itemProducer.Buffer.TryDequeue(out item))
                        {
                            actionOnEach(item);
                            threadLocals[i]++;
                        }
                    }
                });
            }

            while (!itemProducer.Stopped)
            {
                Thread.Sleep(TimeSpan.FromMinutes(1));
            }
            return threadLocals.Sum();
        }
        
    }
}
