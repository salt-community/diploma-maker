using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Dto;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FileController(DiplomaMakerContext _context, IMapper _mapper) : ControllerBase
{
    [HttpPost("UploadFile")]
    [ProducesResponseType<string>(StatusCodes.Status201Created)]
    public ActionResult<string> UploadFile(StringFileDto file)
    {
        var stringFile = _mapper.Map<StringFile>(file);
        _context.Files.Add(stringFile);
        _context.SaveChanges();

        return Ok(stringFile.Guid);
    }

    [HttpGet("GetFile/{guid}")]
    [ProducesResponseType<StringFileDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<StringFileDto> GetFile(string guid)
    {
        var file = _context.Files.FirstOrDefault(file => file.Guid.ToString() == guid);

        return file is not null
            ? Ok(file)
            : NotFound($"A file with guid {guid} doesn't exist");
    }

    [HttpGet("GetAllFilesOfType/{fileType}")]
    [ProducesResponseType<List<StringFileDto>>(StatusCodes.Status200OK)]
    public List<StringFileDto> GetAllFilesOfType(string fileType) =>
        _mapper.Map<List<StringFileDto>>(_context.Files.Where(file => file.FileType == fileType));
}
