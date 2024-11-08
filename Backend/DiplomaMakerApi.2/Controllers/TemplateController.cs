using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi._2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateController : ControllerBase
    {
        [HttpPost("SaveTemplate")]
        public void SaveTemplate([FromBody] StringWrapper template)
        {
            Console.WriteLine(template);
        }

        public record StringWrapper(string Content);
    }
}
