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

        private readonly FileUtilityService _fileUtilityService;

        public BlobController(LocalFileStorageService localFileStorageService, GoogleCloudStorageService googleCloudStorageService, IWebHostEnvironment env, FileUtilityService fileUtilityService)
        {
            _localFileStorageService = localFileStorageService;
            _googleCloudStorageService = googleCloudStorageService;
            _env = env;
            _fileUtilityService = fileUtilityService;
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
        public async Task<IActionResult> DownloadAllFiles()
        {
            // var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/DiplomaPdfs");
            // var files = Directory.GetFiles(directoryPath);

            var files = await _googleCloudStorageService.DownloadTemplateBackgroundPdfs("Blob/DiplomaPdfs");

            // if (files.Length == 0)
            // {
            //     return NotFound("No files found.");
            // }

            // var zipFileName = "TemplateBackgroundPdfs.zip";
            // var fileBytes = _fileUtilityService.CreateZipFromFiles(files, zipFileName);

            // return File(fileBytes, "application/zip", zipFileName);
            return files;
        }

    }
}