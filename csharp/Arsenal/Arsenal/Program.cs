using MultiThread;
using System.Collections.Generic;
using System.Collections.Concurrent;
namespace Arsenal
{
    class Program
    {
        static void Main(string[] args)
        {
            ConcurrentQueue<int> length = new ConcurrentQueue<int>();
            ConcurrentFileReader reader = new ConcurrentFileReader(@"D:\Wang\test.txt", str => { length.Enqueue(str.Length); });
            System.Console.WriteLine(reader.ReadLines());

            foreach (int l in length)
            {
                System.Console.WriteLine(l);
            }
        }
    }
}