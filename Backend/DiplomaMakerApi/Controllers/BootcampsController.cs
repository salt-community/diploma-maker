namespace DiplomaMakerApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Dtos;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class BootcampsController(BootcampService bootcampService, StudentService studentService, IMapper mapper) : ControllerBase
{
    private readonly IMapper _mapper = mapper;
    private readonly BootcampService _bootcampService = bootcampService;
    private readonly StudentService _studentService = studentService;

    [HttpPost("PostBootcamp")]
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
    public async Task<ActionResult<IEnumerable<BootcampResponseDto>>> GetBootcamps()
    {
        return _mapper.Map<List<BootcampResponseDto>>(await _bootcampService.GetBootcamps());
    }

    [HttpGet("GetBootcamp/{guid}")]
    public async Task<ActionResult<BootcampResponseDto>> GetBootcamp(Guid guid)
    {
        var bootcamp = await _bootcampService.GetBootcampByGuidId(guid);

        return bootcamp != null
        ? _mapper.Map<BootcampResponseDto>(bootcamp)
        : NotFound();
    }

    [HttpDelete("DeleteBootcamp/{guid}")]
    public async Task<IActionResult> DeleteBootcamp(Guid guid)
    {
        await _bootcampService.DeleteBootcampByGuidId(guid);
        return NoContent();
    }

    [HttpPut("PutBootcamp/{guid}")]
    public async Task<ActionResult<BootcampResponseDto>> PutBootcamp(Guid guid, BootcampRequestUpdateDto requestDto)
    {
        await _bootcampService.PutBootcampAsync(guid, requestDto);
        var updatedBootcamp = await _studentService.ReplaceStudents(requestDto, guid);

        return updatedBootcamp != null
        ? Ok(_mapper.Map<BootcampResponseDto>(updatedBootcamp))
        : NotFound($"Bootcamp with ID {guid} does not exist.");
    }
}

