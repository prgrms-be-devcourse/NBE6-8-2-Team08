package com.devmatch.backend.domain.application.dto.request;

import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;

public record ApplicationStatusUpdateRequestDto(
    @NotBlank
    ApplicationStatus status
) {
}