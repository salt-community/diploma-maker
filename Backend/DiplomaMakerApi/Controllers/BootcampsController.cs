using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class BootcampsController(
    BootcampService _bootcampService,
    StudentService _studentService,
    IMapper _mapper
) : ControllerBase
{
    [HttpPost("PostBootcamp")]
    [ProducesResponseType<BootcampResponseDto>(StatusCodes.Status201Created)]
    public async Task<ActionResult<BootcampResponseDto>> PostBootcamp(BootcampRequestDto requestDto)
    {
        Bootcamp createdBootcamp = await _bootcampService.PostBootcamp(requestDto);

        return CreatedAtAction(
            nameof(GetBootcamps),
            new { id = createdBootcamp.GuidId },
            _mapper.Map<BootcampResponseDto>(createdBootcamp)
        );
    }

    [HttpGet("GetBootcamps")]
    [ProducesResponseType<List<BootcampResponseDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<BootcampResponseDto>>> GetBootcamps()
    {
        return _mapper.Map<List<BootcampResponseDto>>(await _bootcampService.GetBootcamps());
    }

    [HttpGet("GetBootcamp/{guid}")]
    [ProducesResponseType<BootcampResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BootcampResponseDto>> GetBootcamp(Guid guid)
    {
        var bootcamp = await _bootcampService.GetBootcampByGuidId(guid);

        return bootcamp is not null
        ? _mapper.Map<BootcampResponseDto>(bootcamp)
        : NotFound();
    }

    [HttpDelete("DeleteBootcamp/{guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteBootcamp(Guid guid)
    {
        await _bootcampService.DeleteBootcampByGuidId(guid);
        return NoContent();
    }

    [HttpPut("PutBootcamp/{guid}")]
    [ProducesResponseType<BootcampResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BootcampResponseDto>> PutBootcamp(Guid guid, BootcampRequestUpdateDto requestDto)
    {
        await _bootcampService.PutBootcampAsync(guid, requestDto);
        var updatedBootcamp = await _studentService.ReplaceStudents(requestDto, guid);

        return updatedBootcamp is not null
        ? Ok(_mapper.Map<BootcampResponseDto>(updatedBootcamp))
        : NotFound($"Bootcamp with ID {guid} does not exist.");
    }
}

