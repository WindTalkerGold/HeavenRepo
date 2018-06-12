using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HeavenGo.Controllers
{
    [Produces("application/json")]
    [Route("api/translator")]
    public class TranslatorController : Controller
    {
        const string host = "https://api.cognitive.microsofttranslator.com";

        [HttpGet]
        [Route("langdetect")]
        public async Task<object> WordLangDetect(string key, string word)
        {
            const string path = "/breaksentence?api-version=3.0";
            const string uri = host + path;

            System.Object[] body = new System.Object[] {new {Text = word}};
            var requestBody = JsonConvert.SerializeObject(body);

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject(responseBody);

            }
        }

        [HttpPost]
        public async Task<object> Translate(string to, string key)
        {
            const string path = "/translate?api-version=3.0";
            const string uri = host + path;

            string queryUrl = $"{uri}&to={to}";
            byte[] buffer = new byte[1024];
            int readSize = await this.Request.Body.ReadAsync(buffer, 0, buffer.Length);
            string text = Encoding.UTF8.GetString(buffer).TrimEnd('\0');
            System.Object[] body = new System.Object[] { new { Text = text } };
            var requestBody = JsonConvert.SerializeObject(body);

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(queryUrl);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject(responseBody);
            }
        }
    }
}