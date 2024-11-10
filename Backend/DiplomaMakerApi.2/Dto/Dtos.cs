/*
    Dtos

    Defines all model entity dtos for exposure to the frontend.
    Each model entity has exactly one dto. Each dto inherits
    from its corresponding entity but hides the Id.

    This equivalency means that entities can be constructed or
    patched directly from dtos.
*/

using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Dto;
