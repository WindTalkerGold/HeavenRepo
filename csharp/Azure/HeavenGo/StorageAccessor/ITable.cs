
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage.Table;


namespace StorageAccessor
{
    public interface ITable<T> where T : ITableEntity, new()
    {
        IEnumerable<T> GetByPartition(string partitionKey);
        T GetByKey(string partitionKey, string rowKey);

        TableResult InsertOrUpdate(T row);
        IList<TableResult> BatchInsertOrUpdate(IEnumerable<T> rows);
    }
}
