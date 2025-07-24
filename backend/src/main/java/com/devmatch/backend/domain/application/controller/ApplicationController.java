package com.devmatch.backend.domain.application.controller;

import com.devmatch.backend.domain.application.dto.response.ApplicationDetailResponseDto;
import com.devmatch.backend.domain.application.service.ApplicationService;
import com.devmatch.backend.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

  private final ApplicationService applicationService;

  /**
   * 지원서 상세 조회 API
   *
   * @param applicationId 지원서 ID
   * @return 지원서 상세 정보
   */
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<ApplicationDetailResponseDto>> getApplicationDetail(
      @PathVariable Long applicationId
  ) {
    ApplicationDetailResponseDto applicationDetailResponseDto = new ApplicationDetailResponseDto(
        applicationService.getApplicationDetail(applicationId)
    );

    // 성공 응답
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(new ApiResponse<>("조회 성공", applicationDetailResponseDto));
  }
}