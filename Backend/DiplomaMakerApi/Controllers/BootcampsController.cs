namespace DiplomaMakerApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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


    public BootcampsController(BootcampService bootcampservice, StudentService studentservice, TemplateService templateservice,  IMapper mapper)
    {
        _bootcampservice = bootcampservice;

        _studentservice = studentservice;

        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<BootcampResponseDto>> PostBootcamp(BootcampRequestDto requestDto)
    {
        try
        {
            var bootcamp = _mapper.Map<Bootcamp>(requestDto);
            Bootcamp createdBootcamp = await _bootcampservice.PostBootcamp(bootcamp);
            var responseDto = _mapper.Map<BootcampResponseDto>(createdBootcamp);
            return CreatedAtAction(nameof(GetBootcamps), new { id = createdBootcamp.GuidId }, responseDto);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Name of that specific Bootcamp already exits" });
        }

    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BootcampResponseDto>>> GetBootcamps()
    {
        List<Bootcamp> bootcamps = await _bootcampservice.GetBootcamps();
        var bootcampResponseDtos = _mapper.Map<List<BootcampResponseDto>>(bootcamps);
        return Ok(bootcampResponseDtos);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<BootcampResponseDto>> GetBootcampByGuidId(Guid guidId)
    {
        var bootcamp = await _bootcampservice.GetBootcampByGuidId(guidId);
        return bootcamp == null ?
            NotFound(new { message = "Bootcamp with that specific ID does not exist" }) :
            _mapper.Map<BootcampResponseDto>(bootcamp);
    }

    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteBootcamp(Guid guidId)
    {
        try
        {
            await _bootcampservice.DeleteBootcampByGuidId(guidId);
            return Ok();
        }
        catch (ArgumentException e)
        {
            return NotFound(e.Message);
        }

    }

    [HttpPut("{guidId}")]
    public async Task<ActionResult<Bootcamp>> PutBootcamp(Guid guidId, [FromBody] BootcampRequestDto requestDto)
    {
        try
        {
            var bootcamp = await _bootcampservice.PutBootcampAsync(guidId, requestDto);
            return Ok(bootcamp);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (DbUpdateException)
        {
            return BadRequest("Failed to save changes. Bootcamp name needs to be unique.");
        }
    }

    [HttpPut("dynamicfields/{guidId}")]
    public async Task<ActionResult> UpdatePreviewData(Guid guidId, BootcampRequestUpdateDto requestDto)
    {
        try
        {
            var Students = await _studentservice.ReplaceStudents(requestDto, guidId);
            var UpdatedId =  await _bootcampservice.UpdateBootcampTemplate(guidId, requestDto.templateId);
            return Ok();
        
        }
        catch (StudentNotFoundException ex )
        {
            return NotFound(ex.Message);
        }
        catch (ArgumentException ex)
        {
             return NotFound(ex.Message);
        }
        catch (StudentExistsException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        
    }


}

