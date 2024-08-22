using System.IO.Compression;
using AutoMapper;
using DiplomaMakerApi.Dtos.PreviewImage;
using DiplomaMakerApi.Dtos.UserFont;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
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
        private readonly BootcampService _bootcampService;
        private readonly IMapper _mapper;

        public BlobController
        (
            LocalFileStorageService localFileStorageService, 
            GoogleCloudStorageService googleCloudStorageService, 
            IWebHostEnvironment env, IConfiguration configuration, 
            BootcampService bootcampService,
            IMapper mapper
        )
        {
            _localFileStorageService = localFileStorageService;
            _googleCloudStorageService = googleCloudStorageService;
            _env = env;
            _useBlobStorage = bool.Parse(configuration["Blob:UseBlobStorage"]);
            _bootcampService = bootcampService;
            _mapper = mapper;
        }

        [HttpGet("{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFile(string filename)
        {
            return await GetPdfBlob(filename);
        }

        [HttpGet("DiplomaPdfs/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiplomaPdf(string filename)
        {
            return await GetPdfBlob(filename);
        }

        [HttpGet("download-all-templatebackgrounds")]
        [Authorize]
        public async Task<IActionResult> DownloadAllFiles()
        {
            if (!_useBlobStorage)
            {
                return await _localFileStorageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs");
            }
            else{
                return await _googleCloudStorageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs");
            }
        }

        [HttpGet("ImagePreview/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPreviewImage(string filename)
        {
            return await GetImageBlob(filename, "ImagePreview");
        }

        [HttpGet("ImagePreviewLQIP/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLQPreviewImage(string filename)
        {
            return await GetImageBlob(filename, "ImagePreviewLQIP");
        }

        [HttpPut("UpdateStudentsPreviewImage")]
        [AllowAnonymous]
        public async Task<ActionResult<StudentResponseDto>> UpdateStudentsPreviewImages([FromForm] PreviewImageRequestDto previewImageRequestDto)
        {
            var studentResponse = await _bootcampService.PutStudentPreviewImage(previewImageRequestDto);
            return _mapper.Map<StudentResponseDto>(studentResponse);
        }

        [HttpPut("UpdateBundledStudentsPreviewImages")]
        [AllowAnonymous]
        public async Task<ActionResult<List<StudentResponseDto>>> UpdateBundledStudentsPreviewImages([FromForm] PreviewImageRequestsDto previewImageRequestsDto)
        {
            var studentsResponses = await _bootcampService.PutStudentsPreviewImages(previewImageRequestsDto);
            return _mapper.Map<List<StudentResponseDto>>(studentsResponses);
        }

        private async Task<IActionResult> GetPdfBlob(string filename)
        {
            filename = Path.GetFileName(filename);
            
            if (!filename.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            if (!_useBlobStorage)
            {
                var filePath = await _localFileStorageService.GetFilePath(filename, "DiplomaPdfs");

                if (filePath == null)
                {
                    return NotFound("File not found.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, "application/pdf", filename);
            }
            else
            {
                var (fileBytes, contentType) = await _googleCloudStorageService.GetFileFromFilePath(filename, "DiplomaPdfs");

                if (fileBytes == null)
                {
                    return NotFound("File not found.");
                }
                return File(fileBytes, contentType, filename);
            }
        }   


        private async Task<IActionResult> GetImageBlob(string filename, string subDirectory)
        {
            filename = Path.GetFileName(filename);
            
            if (!filename.EndsWith(".webp", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            if (!_useBlobStorage)
            {
                var filePath = await _localFileStorageService.GetFilePath(filename, subDirectory);

                if (filePath == null)
                {
                    return NotFound("File not found.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, "application/webp", filename);
            }
            else
            {
                var (fileBytes, contentType) = await _googleCloudStorageService.GetFileFromFilePath(filename, subDirectory);

                if (fileBytes == null)
                {
                    return NotFound("File not found.");
                }

                return File(fileBytes, "application/webp", filename);
            }   
        }  

        [HttpGet("UserFonts/{fontName}"), HttpHead("UserFonts/{fontName}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFonts(string fontName, FontType fontType)
        {
            var fontFileName = $"{fontName}-{fontType}";
            var fontNameUsed = fontType == FontType.regular ? $"{fontName}" : $"{fontName}-{fontType}";
            var fonts = await GetFontBlob($"{fontNameUsed}.woff", $"UserFonts/{fontName}");
            return fonts;
        }
        private async Task<IActionResult> GetFontBlob(string filename, string subDirectory)
        {
            filename = Path.GetFileName(filename);

            if (!filename.EndsWith(".woff", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type. Only .woff files are supported.");
            }

            if (!_useBlobStorage)
            {
                var filePath = await _localFileStorageService.GetFilePath(filename, subDirectory);

                if (filePath == null)
                {
                    return NotFound("File not found.");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, "font/woff", filename);
            }
            else
            {
                var (fileBytes, contentType) = await _googleCloudStorageService.GetFileFromFilePath(filename, subDirectory);

                if (fileBytes == null)
                {
                    return NotFound("File not found.");
                }

                return File(fileBytes, "font/woff", filename);
            }   
        }
    }
}