using System;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceBusHub
{
    class Program
    {
        private static string ServiceBusConnectionString;
        private static string QueueName;
        private static string ServiceType;

        static void Main(string[] args)
        {
            for (int index = 0; index < args.Length; index++)
            {
                if (args[index] == "--"+nameof(ServiceBusConnectionString))
                    ServiceBusConnectionString = args[index + 1];
                if (args[index] == "--" + nameof(QueueName))
                    QueueName = args[index + 1];
                if (args[index] == "--" + nameof(ServiceType))
                    ServiceType = args[index + 1];
            }

            Program program = new Program();
            
            if (ServiceType == nameof(QueueSender))
            {
                program.SendMessages().GetAwaiter().GetResult();
            }

            if (ServiceType == nameof(StringDataMessageReceiver))
            {
                program.ReceivedMessges().GetAwaiter().GetResult();
            }
        }

        public async Task SendMessages()
        {
            QueueSender sender = new QueueSender(ServiceBusConnectionString, QueueName);
            while (true)
            {
                string line = Console.ReadLine();
                if (string.IsNullOrEmpty(line) || line.StartsWith("--"))
                {
                    break;
                }

                await sender.SendMessages(line.Split());
            }

            await sender.SendMessages(Enumerable.Repeat("Closing", 1));

            await sender.CloseAsync();
        }

        public async Task ReceivedMessges()
        {
            StringDataMessageReceiver receiver = new StringDataMessageReceiver(ServiceBusConnectionString, QueueName);
            
            // Register the function that will process messages
            receiver.RegisterMessageHandler();

            while (!receiver.IsClose)
            {
                await Task.Delay(TimeSpan.FromMinutes(1));
            }

            await receiver.CloseAsync();
        }
    }
}
