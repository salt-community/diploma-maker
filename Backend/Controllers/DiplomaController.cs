using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using AutoMapper;
using Backend.Services;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DiplomaController : ControllerBase
{
    private readonly DiplomaService _service;
    private readonly IMapper _mapper;   

    public DiplomaController(DiplomaService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<DiplomaResponseDto>> PostDiploma(DiplomaRequestDto requestDto)
    {
        try
        {
            var diploma = await _service.PostDiploma(requestDto);
            var responseDto = _mapper.Map<DiplomaResponseDto>(diploma);
            return CreatedAtAction(nameof(GetDiplomas), new { id = diploma.Id }, diploma);
        }
        catch(BootcampNotFoundException)
        {
            return NotFound("Bootcamp you are trying to add this diploma to, does not exist");
        }
        catch(DiplomaExistsException)
        {
            return Conflict(new { message = "This student has already earned a diploma in this bootcamp" });
        }
    }

    // GET: api/Diploma
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Diploma>>> GetDiplomas()
    {

        var diplomas = await _service.GetDiplomas();
        var diplomaResponseDtos = _mapper.Map<List<DiplomaResponseDto>>(diplomas);
        return Ok(diplomaResponseDtos);
    }

    // GET: api/Diploma/David
    [HttpGet("{keyword}")]
    public async Task<ActionResult<IEnumerable<Diploma>>> GetDiplomaByKeyword(string keyword)
    {
        var diplomas = await _service.GetDiplomasByKeyword(keyword);
        var diplomaResponseDtos = _mapper.Map<List<DiplomaResponseDto>>(diplomas);
        return Ok(diplomaResponseDtos);
    }

    // // PUT: api/Diploma/5
    // // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // [HttpPut("{id}")]
    // public async Task<IActionResult> PutDiploma(int id, Diploma diploma)
    // {
    //     if (id != diploma.Id)
    //     {
    //         return BadRequest();
    //     }

    //     _context.Entry(diploma).State = EntityState.Modified;

    //     try
    //     {
    //         await _context.SaveChangesAsync();
    //     }
    //     catch (DbUpdateConcurrencyException)
    //     {
    //         if (!DiplomaExists(id))
    //         {
    //             return NotFound();
    //         }
    //         else
    //         {
    //             throw;
    //         }
    //     }

    //     return NoContent();
    // }

    // // POST: api/Diploma
    // // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

    // // DELETE: api/Diploma/5
    // [HttpDelete("{id}")]
    // public async Task<IActionResult> DeleteDiploma(int id)
    // {
    //     var diploma = await _context.Diploma.FindAsync(id);
    //     if (diploma == null)
    //     {
    //         return NotFound();
    //     }

    //     _context.Diploma.Remove(diploma);
    //     await _context.SaveChangesAsync();

    //     return NoContent();
    // }

    // private bool DiplomaExists(int id)
    // {
    //     return _context.Diploma.Any(e => e.Id == id);
    // }
}

