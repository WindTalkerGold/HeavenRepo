using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace StorageAccessor
{
    public class StorageAccount
    {
        public string GetConnectionString()
        {
            return
                "DefaultEndpointsProtocol=https;AccountName=heaventextb06a;AccountKey=hh31agsXlDO0yg5Eg4Y4R31HZcURGD94VektZfxYyaXIGB3vsqZAC+Tzd+GVQWizwNb7sSNdGLXhdNS2tZjoeg==;EndpointSuffix=core.windows.net";
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
