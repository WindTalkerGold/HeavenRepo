using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus;

namespace ServiceBusHub
{
    public class QueueSender : QueueHub
    {
        public QueueSender(string connectionString, string queueName)
            : base(connectionString, queueName)
        {
        }

        public async Task SendMessages(IEnumerable<string> messages)
        {
            List<Task> sendingTasks = new List<Task>();
            foreach (string message in messages)
            {
                sendingTasks.Add(queueClient.SendAsync(new Message(Encoding.UTF8.GetBytes(message))));
            }

            await Task.WhenAll(sendingTasks);
        }
    }
}
