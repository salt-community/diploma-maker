using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Exceptions;


namespace DiplomaMakerApi.Services;


public class StudentService
{
    private readonly DiplomaMakingContext _context;
    private readonly ILogger<StudentService> _logger;
    private readonly HistorySnapshotService _historySnapshotService;

    public StudentService(DiplomaMakingContext context, ILogger<StudentService> logger, HistorySnapshotService historySnapshotService)
    {
        _context = context;
        _logger = logger;
        _historySnapshotService = historySnapshotService;
    }
    public async Task<Bootcamp?> ReplaceStudents(BootcampRequestUpdateDto requestDto, Guid BootcampGuidId)
    {
        var bootcamp = await _context.Bootcamps.Include(b => b.Students)
                .Include(b => b.Track)
                .FirstOrDefaultAsync(b => b.GuidId == BootcampGuidId);
        
        if (bootcamp == null)
        {
            return null;
        }

        if (requestDto.students.Count == 0)
        {
            throw new NotFoundByGuidException("You need to add students to perform this update");
        }

        _context.Students.RemoveRange(bootcamp.Students);
        await _context.SaveChangesAsync();

        var Students = new List<Student>();
        foreach (var student in requestDto.students)
        {
                var newStudent = new Student
                {
                    Name = student.Name,
                    Email = student.Email,
                    Bootcamp = bootcamp,
                    VerificationCode = student.VerificationCode,
                    LastGenerated = DateTime.UtcNow,
                };
                newStudent.GuidId = student.GuidId ?? newStudent.GuidId;

                _context.Students.Add(newStudent);
                Students.Add(newStudent);
        }
        await _context.SaveChangesAsync();

        await _historySnapshotService.CreateHistorySnapshotFromBootcamp(requestDto, bootcamp);

        var updatedBootcamp = await _context.Bootcamps.Include(b => b.Students)
            .Include(b => b.Track)
            .FirstOrDefaultAsync(b => b.GuidId == BootcampGuidId);

        return updatedBootcamp ?? throw new Exception($"Failed to retrieve updated Bootcamp with ID {BootcampGuidId}");
    }
    public async Task<List<Student>> GetAllStudents(){
        return await _context.Students
            .Include(s => s.Bootcamp)
            .ToListAsync();
    }

    public async Task<List<Student>> GetStudentsByKeyword(string keyword){
        keyword = keyword.ToLower();
        var Students = await _context.Students
            .Include(d => d.Bootcamp)
            .Where(d => d.Name.ToLower().Contains(keyword) 
                || d.Bootcamp.Track.Name.Contains(keyword))
            .ToListAsync();
        return Students;
    }

    public async Task<Student?> GetStudentByGuidId(Guid guidId)
    {
        var Student = await _context.Students
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.GuidId == guidId);

        return Student ?? throw new NotFoundByGuidException("Student", guidId);
    }

    public async Task<Student?> GetStudentByVerificationCode(string verificationCode)
    {
        var Student = await _context.Students
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.VerificationCode == verificationCode);
        return Student;
    }

    public async Task<Student> DeleteStudentByGuidId(Guid guidId)
    {
        var Student = await _context.Students.
            FirstOrDefaultAsync(b => b.GuidId == guidId)
            ?? throw new NotFoundByGuidException("Student", guidId);

        _ = _context.Students.Remove(Student);
        await _context.SaveChangesAsync();
        return Student;
    }
    public async Task<Student> UpdateStudent(Guid GuidID, StudentUpdateRequestDto updateDto)
    {
        var Student = await _context.Students.FirstOrDefaultAsync(b => b.GuidId == GuidID);

        if (Student == null) 
        {
            throw new NotFoundByGuidException("Student", GuidID);    
        } 
        
        Student.Name = updateDto.Name;
        Student.Email = updateDto.Email;
        await _context.SaveChangesAsync();
        return Student;
        
    }
    
}


