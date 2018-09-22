
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;


namespace HeavenGo.V2.Controllers
{
    using ServiceBusConnector;

    public class ServiceBusQueueController : Controller
    {
        // GET api/<controller>
        public string Get()
        {
            return "Test";
        }
        
        [System.Web.Mvc.HttpPost]
        public async Task<string> Post(string queueName, [FromBody] string message)
        {
            ServiceBusConnector connector = new ServiceBusConnector("", queueName);
            await connector.SendMessage(message);
            return "queueName";
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}