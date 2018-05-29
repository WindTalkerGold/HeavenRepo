
namespace MultiThread.Aggregation
{
    public interface IAggregatable<T>
    {
        int GetAggregationLevel();

        T AggregateWith(T another);

        void IncrementAggregationLevel();
    }
}
