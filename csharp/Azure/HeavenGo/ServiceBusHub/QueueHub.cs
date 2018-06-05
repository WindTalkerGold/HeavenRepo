using System;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus;

namespace ServiceBusHub
{
    public abstract class QueueHub
    {
        protected readonly IQueueClient queueClient;

        protected QueueHub(string connectString, string queueName)
        {
            queueClient = new QueueClient(connectString, queueName);
        }

        #region IDisposable Support

        public async Task CloseAsync()
        {
            await queueClient.CloseAsync();
            disposedValue = true;
        }

        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.
                queueClient.CloseAsync().Wait();
                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        ~QueueHub()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(false);
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            GC.SuppressFinalize(this);
        }

        #endregion
    }
}
