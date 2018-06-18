using System.Collections.Generic;
using System.IO;
using Microsoft.WindowsAzure.Storage.Table;

namespace StorageAccessor
{
    public class AzureTable<T> : ITable<T> where T : ITableEntity, new()
    {
        public AzureTable(CloudTableClient clinet, string tableName)
        {
            this.table = clinet.GetTableReference(tableName);
        }

        private readonly CloudTable table;

        public IList<TableResult> BatchInsertOrUpdate(IEnumerable<T> rows)
        {
            int rowsCount = 0;
            TableBatchOperation batchOperation = new TableBatchOperation();

            foreach (T row in rows)
            {
                batchOperation.InsertOrMerge(row);
                rowsCount++;
                if (rowsCount > 100)
                    throw new InvalidDataException("A batch operation can contain at most 100 entities");
            }

            // Execute the batch operation.
            return table.ExecuteBatch(batchOperation);
        }

        public T GetByKey(string partitionKey, string rowKey)
        {
            TableOperation retrieveOperation = TableOperation.Retrieve<T>(partitionKey, rowKey);
            TableResult operationResult = table.Execute(retrieveOperation);
            return (T)operationResult.Result;

        }

        public IEnumerable<T> GetByPartition(string partitionKey)
        {
            var partitionKeyFilterCondition =
                TableQuery.GenerateFilterCondition(nameof(ITableEntity.PartitionKey), QueryComparisons.Equal,
                    partitionKey);
            TableQuery<T> rangeQuery = new TableQuery<T>().Where(partitionKeyFilterCondition);

            // Loop through the results, displaying information about the entity.
            foreach (T entity in table.ExecuteQuery(rangeQuery))
            {
                yield return entity;
            }
        }
        
        public TableResult InsertOrUpdate(T row)
        {
            TableOperation insertOperation = TableOperation.InsertOrMerge(row);
            return table.Execute(insertOperation);
        }
    }
}
