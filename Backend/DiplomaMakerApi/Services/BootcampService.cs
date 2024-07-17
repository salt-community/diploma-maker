using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos;

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
        bootcamp.DiplomaTemplate = await _context.DiplomaTemplates.FirstOrDefaultAsync(d => d.Name == "Default") ?? throw new Exception("Default template does not exist");
        _context.Bootcamps.Add(bootcamp);
        await _context.SaveChangesAsync();
        return bootcamp;
    }

    public async Task<List<Bootcamp>> GetBootcamps() =>
            await _context.Bootcamps
            .Include(b => b.Students)
            .Include(b => b.DiplomaTemplate)
            .ToListAsync();

    public async Task<Bootcamp?> GetBootcampByGuidId(Guid guidId) =>
            await _context.Bootcamps
            .Include(b => b.Students)
            .Include(b => b.DiplomaTemplate)
            .FirstOrDefaultAsync(b => b.GuidId == guidId);

    public async Task<Bootcamp> DeleteBootcampByGuidId(Guid guidId)
    {
        var bootcamp = await _context.Bootcamps.FirstOrDefaultAsync(b => b.GuidId == guidId);
        if (bootcamp == null)
        {
            throw new ArgumentException("The specifc ID for Bootcamp does not exist");
        }
        _context.Remove(bootcamp);
        await _context.SaveChangesAsync();

        return bootcamp;
    }

    public async Task<int> UpdateBootcampTemplate(Guid bootcampId, int templateId)
    {
        var bootcamp = await _context.Bootcamps.FirstOrDefaultAsync(b => b.GuidId == bootcampId);
        if (bootcamp == null)
        {
            throw new ArgumentException("The specific ID for Bootcamp does not exist");
        }

        var newDiplomaTemplate = await _context.DiplomaTemplates.FirstOrDefaultAsync(dt => dt.Id == templateId);
        if (newDiplomaTemplate == null)
        {
            throw new ArgumentException("The template ID is not valid");
        }

        bootcamp.DiplomaTemplate = newDiplomaTemplate;
        return await _context.SaveChangesAsync();
    }



    public async Task<Bootcamp> PutBootcampAsync(Guid GuidID, BootcampRequestDto requestDto)
    {
            var bootcamp = await _context.Bootcamps
                .FirstOrDefaultAsync(b => b.GuidId == GuidID) ?? throw new ArgumentException("The specifc ID for Bootcamp does not exist");

            bootcamp.Name = requestDto.Name;
            bootcamp.GraduationDate = requestDto.GraduationDate;

            await _context.SaveChangesAsync();
            return bootcamp;
       
     

    }




}