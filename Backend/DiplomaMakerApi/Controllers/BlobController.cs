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
        private async Task<IActionResult> GetFile(string fileName, string subDirectory)
        {
            var extension = Path.GetExtension(fileName);
            fileName = Path.GetFileName(fileName);

            if (!String.Equals(extension, "pdf", StringComparison.OrdinalIgnoreCase) ||
                !String.Equals(extension, "wepb", StringComparison.OrdinalIgnoreCase) ||
                !String.Equals(extension, "woff", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Invalid file type.");

            var fileBytes = await _storageService.GetFileFromPath(fileName, subDirectory);

            if (fileBytes == null) return NotFound($"File {fileName} not found.");

            return File(fileBytes, $"application/{extension}", fileName);
        }

        [HttpGet("GetTemplateBackground/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTemplateBackground(string filename) =>
            await GetFile(filename, "DiplomaPdfs");

        [HttpGet("GetTemplateBackgrounds")]
        // [Authorize]
        public async Task<IActionResult> GetTemplateBackgrounds()
        {
            return await _storageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs");
        }

        [HttpGet("GetDiploma/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiploma(string filename) => await GetFile(filename, "ImagePreview");

        [HttpGet("GetDiplomaThumbnail/{filename}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiplomaThumbnail(string filename) => await GetFile(filename, "ImagePreviewLQIP");

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

        [HttpGet("GetFont/{fontName}/{fontType}"), HttpHead("GetFont/{fontName}/{fontType}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFont(string fontName, FontType fontType)
        {
            var fontNameUsed = fontType == FontType.regular ? $"{fontName}" : $"{fontName}-{fontType}";
            var font = await GetFile($"{fontNameUsed}.woff", $"UserFonts/{fontName}");
            return font;
        }
    }
}