using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus;

namespace ServiceBusConnector
{
    public class ServiceBusConnector
    {
        public string QueueName { get; }
        public string ConnectionString { get; }
        private readonly IQueueClient queueClient;

        public ServiceBusConnector(string connectString, string queueName)
        : this(connectString, queueName, new QueueClient(connectString, queueName))
        {
        }

        public ServiceBusConnector(string connectString, string queueName, IQueueClient queueClient)
        {
            this.ConnectionString = connectString;
            this.QueueName = queueName;
            this.queueClient = queueClient;
        }

        public async Task SendMessage(string message)
        {
            Message msg = new Message(Encoding.UTF8.GetBytes(message));
            await queueClient.SendAsync(msg);
        }
    }
}
