using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            var diploma = _mapper.Map<Diploma>(requestDto);
            await _service.PostDiploma(diploma, requestDto.BootcampGuidId);
            var responseDto = _mapper.Map<DiplomaResponseDto>(diploma);
            return CreatedAtAction("GetDiploma", new { id = diploma.Id }, diploma);
        }
        catch(ArgumentException)
        {
            return Conflict(new { message = "This student has already earned a diploma in this bootcamp" });
        }
    }

    // // GET: api/Diploma
    // [HttpGet]
    // public async Task<ActionResult<IEnumerable<Diploma>>> GetDiploma()
    // {
    //     return await _context.Diploma.ToListAsync();
    // }

    // // GET: api/Diploma/5
    // [HttpGet("{id}")]
    // public async Task<ActionResult<Diploma>> GetDiploma(int id)
    // {
    //     var diploma = await _context.Diploma.FindAsync(id);

    //     if (diploma == null)
    //     {
    //         return NotFound();
    //     }

    //     return diploma;
    // }

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

