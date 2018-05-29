
using System;
using MultiThread.Aggregation;

namespace Arsenal.CombinerDemo
{
    class WordCountEvent : IAggregatable<WordCountEvent>
    {
        public string Word { get; }

        public long Count { get; private set; }

        private int aggregatedLevel;

        public WordCountEvent(string word)
        {
            Word = word;
            Count = 1;
            aggregatedLevel = 1;
        }

        public WordCountEvent AggregateWith(WordCountEvent another)
        {
            if (another == null || this.Word != another.Word)
                throw new ArgumentException("the event being aggregated must not be null and must have the same value of Word!");

            this.Count += another.Count;
            return this;
        }

        public int GetAggregationLevel() => aggregatedLevel;

        public void IncrementAggregationLevel()
        {
            aggregatedLevel++;
        }
    }
}
