using System.IO.Compression;
using AutoMapper;
using DiplomaMakerApi.Dtos.Diploma;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlobController(
        LocalFileStorageService localFileStorageService,
        GoogleCloudStorageService googleCloudStorageService,
        IWebHostEnvironment env, IConfiguration configuration,
        BootcampService bootcampService,
        IMapper mapper
        ) : Controller
    {
        private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
        private readonly GoogleCloudStorageService _googleCloudStorageService = googleCloudStorageService;
        private readonly IWebHostEnvironment _env = env;
        private readonly bool _useBlobStorage = bool.Parse(configuration["Blob:UseBlobStorage"]
                ?? throw new InvalidOperationException("Blob:UseBlobStorage configuration is missing"));
        private readonly BootcampService _bootcampService = bootcampService;
        private readonly IMapper _mapper = mapper;

        [HttpGet("GetTemplateBackground/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTemplateBackground(string filename) =>
            await GetPdfBlob(filename);

        [HttpGet("GetTemplateBackgrounds")]
        // [Authorize]
        public async Task<IActionResult> GetTemplateBackgrounds()
        {
            return _useBlobStorage
            ? await _googleCloudStorageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs")
            : await _localFileStorageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs");
        }

        [HttpGet("GetDiploma/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiploma(string filename) => await GetImageBlob(filename, "ImagePreview");

        [HttpGet("GetDiplomaThumbnail/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiplomaThumbnail(string filename) => await GetImageBlob(filename, "ImagePreviewLQIP");

        [HttpPut("PutDiploma")]
        [AllowAnonymous]
        public async Task<ActionResult<StudentResponseDto>> PutDiploma([FromBody] DiplomaPutRequestDto diplomaPutRequest)
        {
            var studentResponse = await _bootcampService.PutDiploma(diplomaPutRequest);
            return _mapper.Map<StudentResponseDto>(studentResponse);
        }

        [HttpPut("PutDiplomas")]
        [AllowAnonymous]
        public async Task<ActionResult<List<StudentResponseDto>>> PutDiplomas([FromBody] List<DiplomaPutRequestDto> diplomaPutRequests)
        {
            var studentsResponses = await _bootcampService.PutDiplomas(diplomaPutRequests);
            return _mapper.Map<List<StudentResponseDto>>(studentsResponses);
        }

        private async Task<IActionResult> GetPdfBlob(string filename)
        {
            filename = Path.GetFileName(filename);

            if (!filename.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            if (_useBlobStorage)
            {
                var (fileBytes, contentType) = await _googleCloudStorageService.GetFileFromFilePath(filename, "DiplomaPdfs");

                if (fileBytes == null)
                {
                    return NotFound("File not found.");
                }
                return File(fileBytes, contentType, filename);
            }
            else
            {
                var filePath = await _localFileStorageService.GetFilePath(filename, "DiplomaPdfs");

                if (filePath == null)
                {
                    return NotFound("File not found.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, "application/pdf", filename);
            }
        }

        private async Task<IActionResult> GetImageBlob(string filename, string subDirectory)
        {
            filename = Path.GetFileName(filename);

            if (!filename.EndsWith(".webp", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            byte[] fileBytes;

            if (_useBlobStorage)
            {
                fileBytes = (await _googleCloudStorageService.GetFileFromFilePath(filename, subDirectory)).FileBytes;

                if (fileBytes == null) return NotFound("File not found.");
            }
            else
            {
                var filePath = await _localFileStorageService.GetFilePath(filename, subDirectory);

                if (filePath == null) return NotFound("File not found.");

                fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            }

            return File(fileBytes, "application/webp", filename);
        }

        [HttpGet("GetFont/{fontName}/{fontType}"), HttpHead("GetFont/{fontName}/{fontType}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFont(string fontName, FontType fontType)
        {
            var fontNameUsed = fontType == FontType.regular ? $"{fontName}" : $"{fontName}-{fontType}";
            var font = await GetFontBlob($"{fontNameUsed}.woff", $"UserFonts/{fontName}");
            return font;
        }

        private async Task<IActionResult> GetFontBlob(string filename, string subDirectory)
        {
            filename = Path.GetFileName(filename);

            if (!filename.EndsWith(".woff", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type. Only .woff files are supported.");
            }

            byte[] fileBytes;

            if (_useBlobStorage)
            {
                fileBytes = (await _googleCloudStorageService.GetFileFromFilePath(filename, subDirectory)).FileBytes;

                if (fileBytes == null) return NotFound("File not found.");
            }
            else
            {
                var filePath = await _localFileStorageService.GetFilePath(filename, subDirectory);

                if (filePath == null) return NotFound("File not found.");

                fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            }

            return File(fileBytes, "font/woff", filename);
        }
    }
}