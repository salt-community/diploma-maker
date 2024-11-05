using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class StudentsController(StudentService _service, IMapper _mapper) : ControllerBase
{
    [HttpGet("GetStudents")]
    public async Task<ActionResult<List<StudentResponseDto>>> GetStudents()
    {
        var students = await _service.GetAllStudents();
        return _mapper.Map<List<StudentResponseDto>>(students);
    }

    [HttpGet("GetStudent/{guid}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudent(Guid guid)
    {
        var student = await _service.GetStudentByGuidId(guid);
        return _mapper.Map<StudentResponseDto>(student);
    }

    [HttpGet("GetStudentByVericationCode/{verificationCode}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudentByVerificationCode(string verificationCode)
    {
        var student = await _service.GetStudentByVerificationCode(verificationCode);
        return student != null
            ? _mapper.Map<StudentResponseDto>(student)
            : NotFound();
    }

    [HttpPut("UpdateStudent/{guid}")]
    public async Task<ActionResult<StudentResponseDto>> UpdateStudent(Guid guid, StudentUpdateRequestDto updateDto)
    {
        return ModelState.IsValid
            ? _mapper.Map<StudentResponseDto>(await _service.UpdateStudent(guid, updateDto))
            : BadRequest(ModelState);
    }

    [HttpDelete("DeleteStudent/{guid}")]
    public async Task<IActionResult> DeleteStudent(Guid guid)
    {
        await _service.DeleteStudentByGuidId(guid);
        return NoContent();
    }
}

