using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using AutoMapper;
using Backend.Services;
using Backend.Dtos;

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

    [HttpPost("single")]
    public async Task<ActionResult<DiplomaResponseDto>> PostDiploma(DiplomaRequestDto requestDto)
    {
        try
        {
            var diploma = await _service.PostDiploma(requestDto);
            var responseDto = _mapper.Map<DiplomaResponseDto>(diploma);
            return CreatedAtAction(nameof(GetDiplomaByKeyword), new { id = diploma.GuidId }, diploma);
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

    [HttpPut("single")]
    public async Task<ActionResult<DiplomaResponseDto>> PutDiploma(DiplomaPutRequestDto updateDto)
    {
        try
        {
            var diplomaRequest = _mapper.Map<Diploma>(updateDto);
            var updatedDiploma = await _service.UpdateDiploma(diplomaRequest);
            if (updatedDiploma == null)
            {
                return NotFound("Diploma not found");
            }
            var responseDto = _mapper.Map<DiplomaResponseDto>(updatedDiploma);
            return Ok(responseDto);
        }
        catch (BootcampNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }
    }

    [HttpPost("many")]
    public async Task<ActionResult<List<DiplomaResponseDto>>> PostDiplomas(DiplomasRequestDto requestDto)
    {
        try
        {
            var diplomas = await _service.PostDiplomas(requestDto);
            var responseDtos = diplomas.Select(d => _mapper.Map<DiplomaResponseDto>(d)).ToList();

            if (responseDtos.Any())
            {
                return CreatedAtAction(nameof(GetDiplomaByGuidId), new { guidId = responseDtos.First().GuidId }, responseDtos);
            }
            else
            {
                return BadRequest("No diplomas were created.");
            }
        }
        catch (BootcampNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (DiplomaExistsException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }


    // GET: api/Diploma
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DiplomaResponseDto>>> GetDiplomas()
    {

        var diplomas = await _service.GetDiplomas();
        var diplomaResponseDtos = _mapper.Map<List<DiplomaResponseDto>>(diplomas);
        return Ok(diplomaResponseDtos);
    }

    // GET: api/Diploma/David
    [HttpGet(" ")]
    public async Task<ActionResult<IEnumerable<DiplomaResponseDto>>> GetDiplomaByKeyword(string keyword)
    {
        var diplomas = await _service.GetDiplomasByKeyword(keyword);
        var diplomaResponseDtos = _mapper.Map<List<DiplomaResponseDto>>(diplomas);
        return Ok(diplomaResponseDtos);
    }

    // GET: api/Diploma/5
    [HttpGet("{guidId}")]
    public async Task<ActionResult<DiplomaResponseDto>> GetDiplomaByGuidId(string guidId)
    {
        var diploma = await _service.GetDiplomaByGuidId(guidId);
        if (diploma == null)
            return NotFound();
        var responseDto = _mapper.Map<DiplomaResponseDto>(diploma);

        return responseDto;
    }

    // DELETE: api/Diploma/5
    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteDiploma(string guidId)
    {
        try
        {
            await _service.DeleteDiplomaByGuidId(guidId);
        }
        catch(BootcampNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }

        return NoContent();
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

    // private bool DiplomaExists(int id)
    // {
    //     return _context.Diploma.Any(e => e.Id == id);
    // }
}

