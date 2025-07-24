package com.devmatch.backend.domain.project.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record ProjectCreateRequest(
    long userId,
    @Size(min = 1, max = 200) String title,
    @Size(min = 1, max = 2000) String description,
    @Size(min = 1, max = 500) String techStack,
    @Min(1) int teamSize
) {

}