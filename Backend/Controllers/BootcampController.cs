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

    // POST: api/Bootcamp
    [HttpPost]
    public async Task<ActionResult<BootcampResponseDto>> PostBootcamp(BootcampRequestDto requestDto)
    {
        try
        {
            var bootcamp = _mapper.Map<Bootcamp>(requestDto);
            await _service.PostBootcamp(bootcamp);
            var responseDto = _mapper.Map<BootcampResponseDto>(bootcamp);
            return CreatedAtAction(nameof(GetBootcamps), new { id = bootcamp.Id }, responseDto);
        }
        catch (ArgumentException)
        {
            return Conflict(new { message = "A bootcamp with the same name already exists." });
        }

    }


    // GET: api/Bootcamp
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bootcamp>>> GetBootcamps()
    {
        var bootcamps = await _service.GetBootcamps();
        var bootcampResponseDtos = _mapper.Map<List<BootcampResponseDto>>(bootcamps);
        return Ok(bootcampResponseDtos);
    }

    // GET: api/Bootcamp/5
    [HttpGet("{guidId}")]
    public async Task<ActionResult<BootcampResponseDto>> GetBootcampByGuidId(string guidId)
    {
        var bootcamp = await _service.GetBootcampByGuidId(guidId);
        if (bootcamp == null)
            return NotFound();
        var responseDto = _mapper.Map<BootcampResponseDto>(bootcamp);

        return responseDto;
    }


    // DELETE: api/Bootcamp/5
    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteBootcamp(string guidId)
    {   
        try
        {
            var bootcamp = await _service.DeleteBootcampByGuidId(guidId);
        }
        catch(ArgumentException)
        {
            return NotFound("Bootcamp not found");
        }
        return Ok();
    }


    // PUT: api/Bootcamp/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{guidId}")]
    public async Task<IActionResult> PutBootcamp(string guidId, BootcampRequestDto requestDto)
    {
        if (guidId != requestDto.GuidId.ToString())
        {
            return BadRequest();
        }
        try{
            _service.PutBootcamp(guidId, requestDto);
        }catch(DbUpdateException){
            
        }

        return Ok();
    }


}

