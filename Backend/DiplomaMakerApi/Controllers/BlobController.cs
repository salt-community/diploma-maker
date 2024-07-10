using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlobController : Controller
    {
        private readonly LocalFileStorageService _localFileStorageService;

        public BlobController(LocalFileStorageService localFileStorageService)
        {
            _localFileStorageService = localFileStorageService;
        }

        [HttpGet("{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            if (!fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest();
            }

            var filePath = _localFileStorageService.GetFilePath(fileName);

            if (filePath == null)
            {
                return NotFound();
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/pdf", fileName);
        }
    }
}