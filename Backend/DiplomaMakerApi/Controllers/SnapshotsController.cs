using AutoMapper;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
public class SnapshotsController(SnapshotService _historySnapShotService, IMapper _mapper) : ControllerBase
{
    [HttpGet("GetSnapshots")]
    [ProducesResponseType<List<SnapshotResponseDto>>(StatusCodes.Status200OK)]
    // [Authorize]
    public async Task<ActionResult<List<SnapshotResponseDto>>> GetSnapshots()
    {
        var snapshots = await _historySnapShotService.GetSnapshots();
        return _mapper.Map<List<SnapshotResponseDto>>(snapshots);
    }

    [HttpGet("GetSnapshot/{verificationCode}")]
    [ProducesResponseType<List<SnapshotResponseDto>>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<List<SnapshotResponseDto>>> GetSnapshot(string verificationCode)
    {
        var snapshots = await _historySnapShotService.GetSnapshotsByVerificationCode(verificationCode);
        return _mapper.Map<List<SnapshotResponseDto>>(snapshots);
    }

    [HttpPut("MakeSnapshotActive")]
    [ProducesResponseType<List<SnapshotResponseDto>>(StatusCodes.Status200OK)]
    // [Authorize]
    public async Task<ActionResult<List<SnapshotResponseDto>>> MakeSnapshotActive([FromBody] MakeSnapshotActiveRequestDto makeActiveSnapshotRequestDto)
    {
        var changedHistorySnapshot = await _historySnapShotService.MakeSnapshotActive(makeActiveSnapshotRequestDto);
        return _mapper.Map<List<SnapshotResponseDto>>(changedHistorySnapshot);
    }
}