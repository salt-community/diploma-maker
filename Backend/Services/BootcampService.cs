using Microsoft.EntityFrameworkCore;
using Backend.Models;
using AutoMapper;

namespace Backend.Services;

public class BootcampService
{
    private readonly DiplomaMakingContext _context;
    private readonly IMapper _mapper;


    public BootcampService(DiplomaMakingContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Bootcamp> PostBootcamp(Bootcamp bootcamp)
    {
        var existingBootcamp = await _context.Bootcamp
            .FirstOrDefaultAsync(b => b.Name == bootcamp.Name);   
        if(existingBootcamp != null)
            throw new ArgumentException("Bootcamp with this name exists");
        
        _context.Bootcamp.Add(bootcamp);
        await _context.SaveChangesAsync();
        
        return bootcamp;
    }

    public async Task<List<Bootcamp>> GetBootcamps()
    {
        return await _context.Bootcamp.ToListAsync();
    }
}