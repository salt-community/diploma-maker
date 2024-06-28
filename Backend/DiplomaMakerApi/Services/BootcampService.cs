using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public class BootcampService
{
    private readonly DiplomaMakingContext _context;

    public BootcampService(DiplomaMakingContext context)
    {
        _context = context;
    }

    public async Task<Bootcamp> PostBootcamp(Bootcamp bootcamp)
    {
        _context.Bootcamp.Add(bootcamp);
        await _context.SaveChangesAsync();
        return bootcamp;
    }

    public async Task<List<Bootcamp>> GetBootcamps() =>
            await _context.Bootcamp
            .Include(b => b.Diplomas)
            .Include(b =>b.template)
                .ThenInclude(t => t.introStyling)
            .Include(b =>b.template)
                .ThenInclude(t => t.mainStyling)
            .Include(b =>b.template)
                .ThenInclude(t => t.footerStyling)
            .ToListAsync();

    public async Task<Bootcamp?> GetBootcampByGuidId(Guid guidId) => 
            await _context.Bootcamp
            .Include(b => b.Diplomas)
            .Include(b =>b.template)
            .FirstOrDefaultAsync(b => b.GuidId == guidId);

    public async Task<Bootcamp> DeleteBootcampByGuidId(Guid guidId)
    {
        var bootcamp = await _context.Bootcamp.FirstOrDefaultAsync(b => b.GuidId == guidId);
        if (bootcamp == null)
        {
            throw new ArgumentException("The specifc ID for Bootcamp does not exist");
        }
        _context.Remove(bootcamp);
        await _context.SaveChangesAsync();

        return bootcamp;
    }


    public async Task<Bootcamp> PutBootcampAsync(Guid GuidID, BootcampRequestDto requestDto) 
    {
        try
        {
            var bootcamp = await _context.Bootcamp
                .FirstOrDefaultAsync(b => b.GuidId == GuidID) ?? throw new ArgumentException("The specifc ID for Bootcamp does not exist");

            bootcamp.Name = requestDto.Name;
            bootcamp.graduationDate = requestDto.graduationDate;

            await _context.SaveChangesAsync();
            return bootcamp;
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException("Failed to save changes Bootcamp name needs to be unique");
        }

    }


}