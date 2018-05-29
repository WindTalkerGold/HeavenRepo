using System;
using System.Collections.Concurrent;

namespace Arsenal.CombinerDemo
{
    class WordCountEventQueue
    {
        public int NumBuckets { get; }

        public ConcurrentQueue<WordCountEvent>[] Buckets;

        public WordCountReducer Reducer { get; set; }

        private Random rand = new Random();

        public WordCountEventQueue(int numBuckets)
        {
            NumBuckets = numBuckets;
            Buckets = new ConcurrentQueue<WordCountEvent>[numBuckets];
            for (int i = 0; i < numBuckets; i++)
            {
                Buckets[i] = new ConcurrentQueue<WordCountEvent>();
            }
        }

        public void EnqueueEvent(WordCountEvent evt)
        {
            int aggregateLevel = evt.GetAggregationLevel();
            int bucketId;
            if (aggregateLevel < Reducer.MinAggregationLevelBeforeExecution)
            {
                bucketId = rand.Next(Buckets.Length);
            }
            else
            {
                int wordHashCode = evt.Word.GetHashCode();
                bucketId = Math.Abs(wordHashCode) % NumBuckets;
            }

            Buckets[bucketId].Enqueue(evt);
        }
    }
}
