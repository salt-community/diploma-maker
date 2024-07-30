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

        public BlobController(LocalFileStorageService localFileStorageService, GoogleCloudStorageService googleCloudStorageService, IWebHostEnvironment env)
        {
            _localFileStorageService = localFileStorageService;
            _googleCloudStorageService = googleCloudStorageService;
            _env = env;
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetFile(string fileName)
        {
            if (!fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }
            
            if (_env.IsDevelopment())
            {
                var filePath = await _localFileStorageService.GetFilePath(fileName);

                if (filePath == null)
                {
                    return NotFound("File not found.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, "application/pdf", fileName);
            }
            else
            {
                var (fileBytes, contentType) = await _googleCloudStorageService.GetFileFromFilePath(fileName);

                if (fileBytes == null)
                {
                    return NotFound("File not found.");
                }

                return File(fileBytes, contentType, fileName);
            }
        }

        [HttpGet("download-all-templatebackgrounds")]
        public IActionResult DownloadAllFiles()
        {
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/DiplomaPdfs");
            var files = Directory.GetFiles(directoryPath);

            if (files.Length == 0)
            {
                return NotFound("No files found.");
            }

            var zipFileName = "DiplomaPdfs.zip";
            var zipFilePath = Path.Combine(directoryPath, zipFileName);

            using (var zip = ZipFile.Open(zipFilePath, ZipArchiveMode.Create))
            {
                foreach (var file in files)
                {
                    zip.CreateEntryFromFile(file, Path.GetFileName(file));
                }
            }

            var fileBytes = System.IO.File.ReadAllBytes(zipFilePath);
            System.IO.File.Delete(zipFilePath);
            return File(fileBytes, "application/zip", zipFileName);
        }

        [HttpPost]
        public async Task<IActionResult> SaveFile(IFormFile file, string templateName)
        {
            await _googleCloudStorageService.SaveFile(file, templateName);
            return Ok(file);
        }

    }
}