namespace DiplomaMakerApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using AutoMapper;
using DiplomaMakerApi.Dtos;

[Route("api/[controller]")]
[ApiController]
public class BootcampsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly BootcampService _bootcampservice;
    private readonly StudentService _studentservice;


    public BootcampsController(BootcampService bootcampservice, StudentService studentservice, TemplateService templateservice, IMapper mapper)
    {
        _bootcampservice = bootcampservice;

        _studentservice = studentservice;

        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<BootcampResponseDto>> PostBootcamp(BootcampRequestDto requestDto)
    {
        Bootcamp createdBootcamp = await _bootcampservice.PostBootcamp(requestDto);
        return CreatedAtAction(nameof(GetBootcamps), new { id = createdBootcamp.GuidId }, _mapper.Map<BootcampResponseDto>(createdBootcamp));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BootcampResponseDto>>> GetBootcamps()
    {
        var bootcamps = await _bootcampservice.GetBootcamps();
        return _mapper.Map<List<BootcampResponseDto>>(bootcamps);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<BootcampResponseDto>> GetBootcampByGuidId(Guid guidId)
    {
        var bootcamp = await _bootcampservice.GetBootcampByGuidId(guidId);
        return _mapper.Map<BootcampResponseDto>(bootcamp);
    }

    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteBootcamp(Guid guidId)
    {  
        await _bootcampservice.DeleteBootcampByGuidId(guidId);
        return Ok();
    }

    [HttpPut("{guidId}")]
    public async Task<ActionResult<BootcampResponseDto>> PutBootcamp(Guid guidId, [FromBody] BootcampRequestDto requestDto)
    {
        var updatedBootcamp = await _bootcampservice.PutBootcampAsync(guidId, requestDto);
        if (updatedBootcamp == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<BootcampResponseDto>(updatedBootcamp));
    }

    [HttpPut("dynamicfields/{guidId}")]
    public async Task<ActionResult<BootcampResponseDto>> UpdatePreviewData(Guid guidId, BootcampRequestUpdateDto requestDto)
    {
        var updatedBootcamp = await _studentservice.ReplaceStudents(requestDto, guidId);
        await _bootcampservice.UpdateBootcampTemplate(guidId, requestDto.templateId);
        return _mapper.Map<BootcampResponseDto>(updatedBootcamp);
    }

}

