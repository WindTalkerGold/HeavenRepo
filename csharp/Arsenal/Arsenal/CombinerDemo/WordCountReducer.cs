using System;
using System.IO;
using MultiThread.Aggregation;


namespace Arsenal.CombinerDemo
{
    class WordCountReducer : AggregationReducerBase<WordCountEvent>
    {
        public WordCountEventQueue Queue { get; set; }

        public string FolderBasePath { get; }

        public WordCountReducer(int aggregateLevel, string wordCountFolder) 
            : base(aggregateLevel)
        {
            this.FolderBasePath = wordCountFolder;
        }
        
        protected override void ProcessAggregatedEvent(WordCountEvent evt)
        {
            try
            {
                string filePath = Path.Combine(FolderBasePath, evt.Word + ".tsv");
                if (!File.Exists(filePath))
                {
                    File.WriteAllText(filePath, evt.Count.ToString());
                    return;
                }

                string originalCountStr = File.ReadAllText(filePath);
                long originalCount = long.Parse(originalCountStr);
                File.WriteAllText(filePath, (originalCount + evt.Count).ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        protected override void SendBackAggregatedEvent(WordCountEvent evt)
        {
            Queue.EnqueueEvent(evt);
        }
    }
}
