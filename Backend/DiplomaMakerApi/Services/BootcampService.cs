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
        _context.Bootcamps.Add(bootcamp);
        await _context.SaveChangesAsync();
        return bootcamp;
    }

    public async Task<List<Bootcamp>> GetBootcamps() =>
            await _context.Bootcamps
            .Include(b => b.Students)
            .Include(b =>b.DiplomaTemplate)
                .ThenInclude(t => t.IntroStyling)
            .Include(b =>b.DiplomaTemplate)
                .ThenInclude(t => t.MainStyling)
            .Include(b =>b.DiplomaTemplate)
                .ThenInclude(t => t.FooterStyling)
            .ToListAsync();

    public async Task<Bootcamp?> GetBootcampByGuidId(Guid guidId) => 
            await _context.Bootcamps
            .Include(b => b.Students)
            .Include(b =>b.DiplomaTemplate)
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


    public async Task<Bootcamp> PutBootcampAsync(Guid GuidID, BootcampRequestDto requestDto) 
    {
        try
        {
            var bootcamp = await _context.Bootcamps
                .FirstOrDefaultAsync(b => b.GuidId == GuidID) ?? throw new ArgumentException("The specifc ID for Bootcamp does not exist");

            bootcamp.Name = requestDto.Name;
            bootcamp.GraduationDate = requestDto.GraduationDate;

            await _context.SaveChangesAsync();
            return bootcamp;
        }
        catch (DbUpdateException)
        {
            throw new DbUpdateException("Failed to save changes Bootcamp name needs to be unique");
        }

    }

    public async Task<Student> UpdateStudent(Guid GuidID, Student updateRequest)
    {
        var Student = await _context.Students.FirstOrDefaultAsync(b => b.GuidId == GuidID);

        if (Student != null)
        {
            Student.Name = updateRequest.Name;
            Student.Email = updateRequest.Email;

            await _context.SaveChangesAsync();
            return Student;
        }
        throw new BootcampNotFoundException("This Student does not exist");
    }


}