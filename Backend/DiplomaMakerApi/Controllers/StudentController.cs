namespace StudentMakerApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using AutoMapper;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class StudentsController(StudentService service, IMapper mapper) : ControllerBase
{
    private readonly StudentService _service = service;
    private readonly IMapper _mapper = mapper;


    [HttpPut("{GuidID}")]
    public async Task<ActionResult<StudentResponseDto>> UpdateStudents(Guid GuidID, StudentUpdateRequestDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var updatedStudent = await _service.UpdateStudent(GuidID, updateDto);
        return _mapper.Map<StudentResponseDto>(updatedStudent);
    }

    [HttpGet]
    public async Task<ActionResult<List<StudentResponseDto>>> GetStudents()
    {    
        var students = await _service.GetAllStudents();
        return _mapper.Map<List<StudentResponseDto>>(students);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudentByGuidId(Guid guidId)
    {
        var Student = await _service.GetStudentByGuidId(guidId);
        return _mapper.Map<StudentResponseDto>(Student);
    }

    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteStudent(Guid guidId)
    {
        await _service.DeleteStudentByGuidId(guidId);
        return NoContent();
    }

    [HttpGet("verificationCode/{verificationCode}")]
    public async Task<ActionResult<StudentResponseDto>> getStudentByVerificationCode(string verificationCode)
    {
        var Student = await _service.GetStudentByVerificationCode(verificationCode);
        if (Student == null)
            return NotFound();
        var responseDto = _mapper.Map<StudentResponseDto>(Student);

        return responseDto;
    }

}

