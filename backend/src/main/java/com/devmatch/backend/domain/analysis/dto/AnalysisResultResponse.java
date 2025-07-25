package com.devmatch.backend.domain.analysis.dto;

import com.devmatch.backend.domain.analysis.entity.AnalysisResult;

public record AnalysisResultResponse(
    Long id,
    Long applicationId,
    double compatibilityScore,
    String compatibilityReason
) {

  public AnalysisResultResponse(AnalysisResult result) {
    this(
        result.getId(),
        result.getApplication().getId(),
        result.getCompatibilityScore(),
        result.getCompatibilityReason()
    );
  }
}