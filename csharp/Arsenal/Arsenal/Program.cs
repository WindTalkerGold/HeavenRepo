using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Arsenal.CombinerDemo;

namespace Arsenal
{
    class Program
    {
        static void Main(string[] args)
        {
            string exitCode = args[0];
            int maxLength = int.Parse(args[1]);

            int currentProcessed = 0;
            while (currentProcessed++ < maxLength)
            {
                string line = Console.ReadLine();
                if (line.Equals(exitCode))
                {
                    break;
                }
                Console.WriteLine(line.Length);
            }
        }


    }
}