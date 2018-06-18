using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace StorageAccessor
{
    public class StorageAccount
    {
        public string GetConnectionString()
        {
            return
                "##connection string goes here##";
        }

        public CloudTableClient GetTableClient()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                GetConnectionString());
            return storageAccount.CreateCloudTableClient();
        }

        public ITable<T> GetCloudTable<T>(string tableName) where T : ITableEntity, new()
        {
            return new AzureTable<T>(GetTableClient(), tableName);
        }
    }
}
