package com.devmatch.backend.domain.project.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjectStatusUpdateRequest(@NotNull @Size(min = 1, max = 20) String status) {

}