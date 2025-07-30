package com.devmatch.backend.domain.application.dto.response;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import java.time.LocalDateTime;

public record ApplicationDetailResponseDto(
    Long applicationId,                  // 지원서 ID
    String nickname,                // 지원자 정보
    ApplicationStatus status, // 지원서 승인 상태
    LocalDateTime appliedAt   // 지원 일시
) {

  public ApplicationDetailResponseDto(Application application) {
    this(
        application.getId(),
        application.getUser().getNickName(),
        application.getStatus(),
        application.getAppliedAt()
    );
  }
}