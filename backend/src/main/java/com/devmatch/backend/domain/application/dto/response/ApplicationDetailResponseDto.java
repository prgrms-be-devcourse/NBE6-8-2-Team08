package com.devmatch.backend.domain.application.dto.response;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import com.devmatch.backend.domain.user.entity.User;
import java.time.LocalDateTime;

public record ApplicationDetailResponseDto(
    Long id,                  // 지원서 ID
    User user,                // 지원자 정보
    ApplicationStatus status, // 지원서 승인 상태
    LocalDateTime appliedAt   // 지원 일시
) {

  public ApplicationDetailResponseDto(Application application) {
    this(
        application.getId(),
        application.getUser(),
        application.getStatus(),
        application.getAppliedAt()
    );
  }
}