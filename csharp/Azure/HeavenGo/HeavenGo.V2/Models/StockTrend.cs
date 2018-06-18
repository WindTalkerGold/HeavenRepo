using Microsoft.WindowsAzure.Storage.Table;

namespace HeavenGo.Models
{
    public class StockTrend : TableEntity
    {
        public StockTrend() : base()
        {
        }

        public string Time { get; set; }
        public double Percent { get; set; }

        public long Volume { get; set; }
        public double Open { get; set; }

        public double High { get; set; }
        public double Close { get; set; }
        public double Low { get; set; }

    }
}
