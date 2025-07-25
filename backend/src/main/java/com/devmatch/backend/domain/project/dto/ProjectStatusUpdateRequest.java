package com.devmatch.backend.domain.project.dto;

import jakarta.validation.constraints.Size;

public record ProjectStatusUpdateRequest(@Size(min = 1, max = 20) String status) {

}