package com.devmatch.backend.domain.project.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ProjectApplyRequest(
    @NotNull @Min(1) Long userId,
    @NotNull List<String> techStacks,
    @NotNull List<Integer> techScores
) {

}