using System.Collections.Generic;
using System.Linq;

namespace MultiThread.Aggregation
{
    public abstract class AggregationReducerBase<TEvent> 
        where TEvent : IAggregatable<TEvent>
    {
        public int MinAggregationLevelBeforeExecution { get; }

        public AggregationReducerBase(int aggregateLevel)
        {
            this.MinAggregationLevelBeforeExecution = aggregateLevel;
        }

        /// <summary>
        /// Process a batch of events. If the events are aggregated for at least MinAggregationLevelBeforeExecution, 
        /// they will be really processed. Otherwise they will be aggregated again
        /// All events here will have the same user key and same AggregationLevel (AggregationLevel will also be used as key)
        /// </summary>
        /// <param name="events"></param>
        public void Process(IEnumerable<TEvent> events)
        {
            TEvent aggregatedEvent = events.Aggregate((evt1, evt2) => evt1.AggregateWith(evt2));
            // there is no event here
            if (aggregatedEvent == null)
                return;
            
            if (aggregatedEvent.GetAggregationLevel() >= MinAggregationLevelBeforeExecution)
            {
                ProcessAggregatedEvent(aggregatedEvent);
            }
            else
            {
                aggregatedEvent.IncrementAggregationLevel();
                SendBackAggregatedEvent(aggregatedEvent);
            }
        }

        protected abstract void SendBackAggregatedEvent(TEvent evt);

        protected abstract void ProcessAggregatedEvent(TEvent evt);
    }
}
