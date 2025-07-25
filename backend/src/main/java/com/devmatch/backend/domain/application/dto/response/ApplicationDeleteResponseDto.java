package com.devmatch.backend.domain.application.dto.response;

import com.devmatch.backend.domain.application.entity.Application;

public record ApplicationDeleteResponseDto(
    Long id // 지원서 ID
) {

  public ApplicationDeleteResponseDto(Application application) {
    this(
        application.getId()
    );
  }
}