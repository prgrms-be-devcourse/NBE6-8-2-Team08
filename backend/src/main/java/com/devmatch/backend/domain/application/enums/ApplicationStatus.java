package com.devmatch.backend.domain.application.enums;

import lombok.Getter;

@Getter
public enum ApplicationStatus {
  PENDING, // 대기중
  APPROVED, // 승인
  REJECTED; // 거절
}
