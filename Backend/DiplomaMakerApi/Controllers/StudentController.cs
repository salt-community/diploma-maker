using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using AutoMapper;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Dtos;

namespace StudentMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StudentController : ControllerBase
{
    private readonly StudentService _service;
    private readonly IMapper _mapper;   

    public StudentController(StudentService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;

    }

    [HttpPost]
    public async Task<ActionResult<StudentResponseDto>> AddStudent(StudentRequestDto requestDto)
    {
        try
        {
            var Student = await _service.PostStudent(requestDto);
            var responseDto = _mapper.Map<StudentResponseDto>(Student);
            return CreatedAtAction(nameof(GetStudentByKeyword), new { id = Student.GuidId }, Student);
        }
        catch(BootcampNotFoundException)
        {
            return NotFound("Bootcamp you are trying to add this student to, does not exist");
        }
        catch(StudentExistsException)
        {
            return Conflict(new { message = "This student has already been added to this bootcamp" });
        }
    }

    [HttpPut]
    public async Task<ActionResult<StudentResponseDto>> UpdateStudent(StudentPutRequestDto updateDto)
    {
        try
        {
            var StudentRequest = _mapper.Map<Student>(updateDto);
            var updatedStudent = await _service.UpdateStudent(StudentRequest);
            if (updatedStudent == null)
            {
                return NotFound("Student not found");
            }
            var responseDto = _mapper.Map<StudentResponseDto>(updatedStudent);
            return Ok(responseDto);
        }
        catch (BootcampNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }
    }

    [HttpPost("many")]
    public async Task<ActionResult<List<StudentResponseDto>>> PostStudents(StudentsRequestDto requestDto)
    {
        try
        {
            var Students = await _service.PostStudents(requestDto);
            var responseDtos = Students.Select(d => _mapper.Map<StudentResponseDto>(d)).ToList();

            if (responseDtos.Any())
            {
                return CreatedAtAction(nameof(GetStudentByGuidId), new { guidId = responseDtos.First().GuidId }, responseDtos);
            }
            else
            {
                return BadRequest("No Students were created.");
            }
        }
        catch (BootcampNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (StudentExistsException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }


    // GET: api/Student
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentResponseDto>>> GetStudents()
    {

        var Students = await _service.GetStudents();
        var StudentResponseDtos = _mapper.Map<List<StudentResponseDto>>(Students);
        return Ok(StudentResponseDtos);
    }

    // GET: api/Student/David
    [HttpGet(" ")]
    public async Task<ActionResult<IEnumerable<StudentResponseDto>>> GetStudentByKeyword(string keyword)
    {
        var Students = await _service.GetStudentsByKeyword(keyword);
        var StudentResponseDtos = _mapper.Map<List<StudentResponseDto>>(Students);
        return Ok(StudentResponseDtos);
    }

    // GET: api/Student/5
    [HttpGet("{guidId}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudentByGuidId(string guidId)
    {
        var Student = await _service.GetStudentByGuidId(guidId);
        if (Student == null)
            return NotFound();
        var responseDto = _mapper.Map<StudentResponseDto>(Student);

        return responseDto;
    }

    // DELETE: api/Student/5
    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteStudent(string guidId)
    {
        try
        {
            await _service.DeleteStudentByGuidId(guidId);
        }
        catch(BootcampNotFoundException)
        {
            return NotFound("Bootcamp not found");
        }

        return NoContent();
    }

}

