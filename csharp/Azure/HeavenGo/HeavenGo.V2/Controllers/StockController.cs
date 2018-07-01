
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using System.Web.Mvc;
using HeavenGo.Models;
using Newtonsoft.Json;
using StorageAccessor;

namespace HeavenGo.Controllers
{
    public class StockController : Controller
    {
        public ActionResult Index(string symbol)
        {
            StorageAccount account = new StorageAccount();
            ITable<StockTrend> stockTable = account.GetCloudTable<StockTrend>("stocktrend");
            var trends = stockTable.GetByPartition(symbol);
            return Json(trends, JsonRequestBehavior.AllowGet);
        }
        public string Index2(string symbol)
        {
            return "aaa";
        }

    }
}