
using System;
using System.Web.Mvc;

namespace HeavenGo.V2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Baby()
        {
            ViewBag.Message = "My Baby.";

            return View();
        }

        public ActionResult TimeConvert(long filetime=0, long ticks=0)
        {
            ViewBag.Message = "Time Convert:";

            DateTime? dt = null;
            if (filetime != 0)
            {
                dt = DateTime.FromFileTimeUtc(filetime);
                ViewBag.Message += $" From filetime [{filetime}]";
            }
            else if (ticks != 0)
            {
                dt = new DateTime(ticks);
                ViewBag.Message += $" From ticks: [{ticks}]";
            }

            ViewBag.Time = dt;
            return View();
        }
    }
}