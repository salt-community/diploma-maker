using System.IO.Compression;
using AutoMapper;
using DiplomaMakerApi.Dtos.Diploma;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlobController(
        IStorageService _storageService,
        BootcampService _bootcampService,
        IMapper _mapper
        ) : Controller
    {
        [HttpGet("GetTemplateBackground/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTemplateBackground(string filename) =>
            await GetPdfBlob(filename);

        [HttpGet("GetTemplateBackgrounds")]
        // [Authorize]
        public async Task<IActionResult> GetTemplateBackgrounds()
        {
            return await _storageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs");
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

        private async Task<IActionResult> GetPdfBlob(string fileName)
        {
            fileName = Path.GetFileName(fileName);

            if (!fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            var fileBytes = await _storageService.GetFileFromPath(fileName);

            if (fileBytes == null) return NotFound("File not found.");

            return File(fileBytes, "application/pdf", fileName);

        }

        private async Task<IActionResult> GetImageBlob(string fileName, string subDirectory)
        {
            fileName = Path.GetFileName(fileName);

            if (!fileName.EndsWith(".webp", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type.");
            }

            var fileBytes = await _storageService.GetFileFromPath(fileName, subDirectory);

            if (fileBytes == null) return NotFound("File not found.");

            return File(fileBytes, "application/webp", fileName);
        }

        [HttpGet("GetFont/{fontName}/{fontType}"), HttpHead("GetFont/{fontName}/{fontType}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFont(string fontName, FontType fontType)
        {
            var fontNameUsed = fontType == FontType.regular ? $"{fontName}" : $"{fontName}-{fontType}";
            var font = await GetFontBlob($"{fontNameUsed}.woff", $"UserFonts/{fontName}");
            return font;
        }

        private async Task<IActionResult> GetFontBlob(string fileName, string subDirectory)
        {
            fileName = Path.GetFileName(fileName);

            if (!fileName.EndsWith(".woff", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid file type. Only .woff files are supported.");
            }

            var fileBytes = await _storageService.GetFileFromPath(fileName, subDirectory);

            if (fileBytes == null) return NotFound("File not found.");

            return File(fileBytes, "font/woff", fileName);
        }
    }
}