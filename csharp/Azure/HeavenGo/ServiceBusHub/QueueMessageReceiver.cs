using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus;

namespace ServiceBusHub
{
    public abstract class QueueMessageReceiver<T> : QueueHub
    {
        public QueueMessageReceiver(string connectionString, string queueName)
            : base(connectionString, queueName)
        {
        }

        public bool IsClose { get; protected set; } = false;

        public abstract T GetFromBytes(byte[] dataRaw);

        public abstract void Process(T data);

        public async Task ProcessMessageAsync(Message message, CancellationToken token)
        {
            // Process the message
            Console.WriteLine($"Received message: SequenceNumber:{message.SystemProperties.SequenceNumber}");
            Process(GetFromBytes(message.Body));

            // Complete the message so that it is not received again.
            // This can be done only if the queueClient is created in ReceiveMode.PeekLock mode (which is default).
            await queueClient.CompleteAsync(message.SystemProperties.LockToken);
        }

        public void RegisterMessageHandler()
        {
            var messageHandlerOptions = new MessageHandlerOptions(ExceptionReceivedHandler)
            {
                // Maximum number of Concurrent calls to the callback `ProcessMessagesAsync`, set to 1 for simplicity.
                // Set it according to how many messages the application wants to process in parallel.
                MaxConcurrentCalls = 1,

                // Indicates whether MessagePump should automatically complete the messages after returning from User Callback.
                // False below indicates the Complete will be handled by the User Callback as in `ProcessMessagesAsync` below.
                AutoComplete = false
            };
            queueClient.RegisterMessageHandler(ProcessMessageAsync, messageHandlerOptions);
        }

        static Task ExceptionReceivedHandler(ExceptionReceivedEventArgs exceptionReceivedEventArgs)
        {
            Console.WriteLine($"Message handler encountered an exception {exceptionReceivedEventArgs.Exception}.");
            var context = exceptionReceivedEventArgs.ExceptionReceivedContext;
            Console.WriteLine("Exception context for troubleshooting:");
            Console.WriteLine($"- Endpoint: {context.Endpoint}");
            Console.WriteLine($"- Entity Path: {context.EntityPath}");
            Console.WriteLine($"- Executing Action: {context.Action}");
            return Task.CompletedTask;
        }
    }

    public class StringDataMessageReceiver : QueueMessageReceiver<string>
    {
        public StringDataMessageReceiver(string connectionString, string queueName)
            : base(connectionString, queueName)
        {
        }

        public override string GetFromBytes(byte[] dataRaw)
        {
            return Encoding.UTF8.GetString(dataRaw);
        }

        public override void Process(string data)
        {
            Console.WriteLine("Demo: recieved message <{0}>", data);
            if (data == "Closing")
                IsClose = true;
        }
    }
}
