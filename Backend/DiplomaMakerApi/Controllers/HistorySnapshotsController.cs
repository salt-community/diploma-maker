using AutoMapper;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
public class SnapshotsController(HistorySnapshotService _historySnapShotService, IMapper _mapper) : ControllerBase
{
    [HttpGet("GetSnapshots")]
    // [Authorize]
    public async Task<ActionResult<List<DiplomaSnapshotResponseDto>>> GetSnapshots()
    {
        var snapshots = await _historySnapShotService.GetHistorySnapshots();
        return _mapper.Map<List<DiplomaSnapshotResponseDto>>(snapshots);
    }

    [HttpGet("GetSnapshot/{verificationCode}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<DiplomaSnapshotResponseDto>>> GetSnapshot(string verificationCode)
    {
        var snapshots = await _historySnapShotService.GetHistorySnapshotsByVerificationCode(verificationCode);
        return _mapper.Map<List<DiplomaSnapshotResponseDto>>(snapshots);
    }

    [HttpPut("MakeSnapshotActive")]
    // [Authorize]
    public async Task<ActionResult<List<DiplomaSnapshotResponseDto>>> MakeSnapshotActive([FromBody] MakeActiveSnapshotRequestDto makeActiveSnapshotRequestDto)
    {
        var changedHistorySnapshot = await _historySnapShotService.MakeSnapshotActive(makeActiveSnapshotRequestDto);
        return _mapper.Map<List<DiplomaSnapshotResponseDto>>(changedHistorySnapshot);
    }
}