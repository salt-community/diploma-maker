using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;


public class StudentService
{
    private readonly DiplomaMakingContext _context;
    private readonly ILogger<StudentService> _logger;


    public StudentService(DiplomaMakingContext context, ILogger<StudentService> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<List<Student>> ReplaceStudents(StudentsRequestDto requestDto)
    {
        var bootcamp = await _context.Bootcamps.Include(b => b.Students)
                .FirstOrDefaultAsync(b => b.GuidId == requestDto.BootcampGuidId)
                ?? throw new Exception($"Bootcamp with ID {requestDto.BootcampGuidId} does not exist");
        
        if (requestDto.Students.Count == 0)
        {
            throw new StudentNotFoundException("You need to add students to perform this update"); 
        }

        _context.Students.RemoveRange(bootcamp.Students);
        await _context.SaveChangesAsync();

        var Students = new List<Student>();
        foreach (var Student in requestDto.Students)
        {
                var newStudent = new Student
                {
                    Name = Student.Name,
                    Email = Student.Email,
                    Bootcamp = bootcamp
                };
                _context.Students.Add(newStudent);
                Students.Add(newStudent);
        }
        await _context.SaveChangesAsync();
        return Students;
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
                || d.Bootcamp.Name.ToLower().Contains(keyword))
            .ToListAsync();
        return Students;
    }

    public async Task<Student?> GetStudentByGuidId(string guidId)
    {
        var Student = await _context.Students
            .Include(d => d.Bootcamp)
            .FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId);
        return Student;
    }

    public async Task<Student> DeleteStudentByGuidId(string guidId)
    {
        var Student = await _context.Students.
            FirstOrDefaultAsync(b => b.GuidId.ToString() == guidId)
            ?? throw new StudentNotFoundException("this bootcamp does not exist");

        _ = _context.Students.Remove(Student);
        await _context.SaveChangesAsync();
        return Student;
    }
    public async Task<Student> UpdateStudent(Guid GuidID, StudentUpdateRequestDto updateDto)
    {
        var Student = await _context.Students.FirstOrDefaultAsync(b => b.GuidId == GuidID);

        if (Student != null)
        {
            Student.Name = updateDto.Name;
            Student.Email = updateDto.Email;

            await _context.SaveChangesAsync();
            return Student;
        }
        throw new StudentNotFoundException("This Student does not exist");
    }
    
}




public class StudentNotFoundException : Exception
{
    public StudentNotFoundException(string message) : base(message) { }
}

public class StudentExistsException : Exception
{
    public StudentExistsException(string message) : base(message) { }
}
