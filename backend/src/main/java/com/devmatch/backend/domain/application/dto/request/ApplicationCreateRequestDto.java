package com.devmatch.backend.domain.application.dto.request;

public record ApplicationCreateRequestDto(
    Long userId,
    Long projectId
) {
}