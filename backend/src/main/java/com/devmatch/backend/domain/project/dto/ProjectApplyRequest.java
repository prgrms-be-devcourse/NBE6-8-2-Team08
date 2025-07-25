package com.devmatch.backend.domain.project.dto;

import jakarta.validation.constraints.Min;
import java.util.List;

public record ProjectApplyRequest(
    @Min(1) Long userId,
    List<String> techStacks,
    List<Integer> techScores
) {

}