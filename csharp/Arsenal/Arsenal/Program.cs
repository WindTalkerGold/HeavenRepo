using Arsenal.CombinerDemo;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Arsenal
{
    class Program
    {
        static void Main(string[] args)
        {
            WordCountCombinerDemo demo = new WordCountCombinerDemo();
            Dictionary<string, string> dict = new Dictionary<string, string>();

            for (int i = 0; i < args.Length; i += 2)
            {
                dict[args[i]] = args[i + 1];
            }

            var properties = demo.GetType().GetProperties();
            foreach (var property in properties)
            {
                string name = property.Name;
                string value = dict["--" + name];
                object parsedValue = null ;
                if (property.PropertyType == typeof(string))
                {
                    parsedValue = value;
                }
                else if (property.PropertyType == typeof(int))
                {
                    parsedValue = int.Parse(value);
                }
                else if (property.PropertyType == typeof(TimeSpan))
                {
                    parsedValue = TimeSpan.Parse(value);
                }

                property.SetValue(demo, parsedValue);
            }

            Task task = demo.Start();
            while (!task.IsCompleted)
            {
                Thread.Sleep(1000 * 60);
            }
        }
    }
}