package com.devmatch.backend.domain.application.dto.request;

import com.devmatch.backend.domain.application.enums.ApplicationStatus;

public record ApplicationCreateRequestDto(
    Long userId,
    Long projectId,
    ApplicationStatus status
) {
}