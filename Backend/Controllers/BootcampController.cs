using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;
using AutoMapper;
namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BootcampController : ControllerBase
{
    private readonly BootcampService _service;
    private readonly IMapper _mapper;

    public BootcampController(BootcampService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<BootcampResponseDto>> PostBootcamp(BootcampRequestDto requestDto)
    {
        try
        {
            var bootcamp = _mapper.Map<Bootcamp>(requestDto);
            Bootcamp createdBootcamp = await _service.PostBootcamp(bootcamp);
            var responseDto = _mapper.Map<BootcampResponseDto>(createdBootcamp);
            return CreatedAtAction(nameof(GetBootcamps), new { id = createdBootcamp.Id }, responseDto);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Name of that specific Bootcamp already exits" });
        }

    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bootcamp>>> GetBootcamps()
    {
        List<Bootcamp> bootcamps = await _service.GetBootcamps();
        var bootcampResponseDtos = _mapper.Map<List<BootcampResponseDto>>(bootcamps);
        return Ok(bootcampResponseDtos);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<BootcampResponseDto>> GetBootcampByGuidId(Guid guidId)
    {
        var bootcamp = await _service.GetBootcampByGuidId(guidId);
        return bootcamp == null ?
            NotFound(new { message = "Bootcamp with that specific ID does not exist" }) :
            _mapper.Map<BootcampResponseDto>(bootcamp);
    }

    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteBootcamp(Guid guidId)
    {
        try
        {
            await _service.DeleteBootcampByGuidId(guidId);
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
            var bootcamp = await _service.PutBootcampAsync(guidId, requestDto);
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



}

