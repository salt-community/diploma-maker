using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BootcampController : ControllerBase
    {
        private readonly DiplomaMakingContext _context;

        public BootcampController(DiplomaMakingContext context)
        {
            _context = context;
        }

        // GET: api/Bootcamp
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bootcamp>>> GetBootcamp()
        {
            return await _context.Bootcamp.ToListAsync();
        }

        // GET: api/Bootcamp/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bootcamp>> GetBootcamp(int id)
        {
            var bootcamp = await _context.Bootcamp.FindAsync(id);

            if (bootcamp == null)
            {
                return NotFound();
            }

            return bootcamp;
        }

        // PUT: api/Bootcamp/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBootcamp(int id, Bootcamp bootcamp)
        {
            if (id != bootcamp.Id)
            {
                return BadRequest();
            }

            _context.Entry(bootcamp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BootcampExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Bootcamp
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Bootcamp>> PostBootcamp(Bootcamp bootcamp)
        {
            _context.Bootcamp.Add(bootcamp);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBootcamp", new { id = bootcamp.Id }, bootcamp);
        }

        // DELETE: api/Bootcamp/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBootcamp(int id)
        {
            var bootcamp = await _context.Bootcamp.FindAsync(id);
            if (bootcamp == null)
            {
                return NotFound();
            }

            _context.Bootcamp.Remove(bootcamp);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BootcampExists(int id)
        {
            return _context.Bootcamp.Any(e => e.Id == id);
        }
    }
}
