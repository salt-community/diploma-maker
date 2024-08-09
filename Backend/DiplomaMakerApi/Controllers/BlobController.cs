using System.IO.Compression;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlobController : Controller
    {
        private readonly LocalFileStorageService _localFileStorageService;
        private readonly GoogleCloudStorageService _googleCloudStorageService;
        private readonly IWebHostEnvironment _env;

        private readonly bool _useBlobStorage;

        public BlobController(LocalFileStorageService localFileStorageService, GoogleCloudStorageService googleCloudStorageService, IWebHostEnvironment env, IConfiguration configuration)
        {
            _localFileStorageService = localFileStorageService;
            _googleCloudStorageService = googleCloudStorageService;
            _env = env;
            _useBlobStorage = bool.Parse(configuration["Blob:UseBlobStorage"]);
        }

        [HttpGet("{filename}")]
        public async Task<IActionResult> GetFile(string filename)
        {
            return await GetFileFromBlob(filename);
        }

        [HttpGet("DiplomaPdfs/{filename}")]
        public async Task<IActionResult> GetDiplomaPdf(string filename)
        {
            return await GetFileFromBlob(filename);
        }

        private async Task<IActionResult> GetFileFromBlob(string filename)
        {
            filename = Path.GetFileName(filename);
            
            if (!filename.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            if (!_useBlobStorage)
            {
                var filePath = await _localFileStorageService.GetFilePath(filename);

                if (filePath == null)
                {
                    return NotFound("File not found.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, "application/pdf", filename);
            }
            else
            {
                var (fileBytes, contentType) = await _googleCloudStorageService.GetFileFromFilePath(filename);

                if (fileBytes == null)
                {
                    return NotFound("File not found.");
                }
                return File(fileBytes, contentType, filename);
            }
        }   

        [HttpGet("download-all-templatebackgrounds")]
        public async Task<IActionResult> DownloadAllFiles()
        {
            if (!_useBlobStorage)
            {
                return await _localFileStorageService.GetFilesFromPath("Blob/DiplomaPdfs", "TemplateBackgroundPdfs.zip");
            }
            else{
                return await _googleCloudStorageService.GetFilesFromPath("Blob/DiplomaPdfs", "TemplateBackgroundPdfs.zip");
            }
        }
    }
}