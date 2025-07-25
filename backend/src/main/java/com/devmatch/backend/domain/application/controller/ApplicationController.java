package com.devmatch.backend.domain.application.controller;

import com.devmatch.backend.domain.application.dto.response.ApplicationDetailResponseDto;
import com.devmatch.backend.domain.application.service.ApplicationService;
import com.devmatch.backend.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    ApplicationDetailResponseDto applicationDetailResponseDto =
        applicationService.getApplicationDetail(applicationId);

    // 성공 응답
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(
            new ApiResponse<>(
                "%s 번 지원서의 상세 정보 조회를 성공했습니다."
                    .formatted(applicationDetailResponseDto),
                applicationDetailResponseDto
            )
        );
  }

  /**
   * 지원서 삭제 API
   *
   * @param applicationId 지원서 ID
   * @return 삭제한 지원서
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<String>> deleteApplication(
      @PathVariable Long applicationId
  ) {
    applicationService.deleteApplication(applicationId);

    // 성공 응답
    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .body(
            new ApiResponse<>(
                "지원서의 삭제를 성공했습니다."
            )
        );
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<ApiResponse<String>> updateApplicationStatus(
      @PathVariable Long applicationId,
      @RequestParam String status
  ) {
//    applicationService.updateApplicationStatus(applicationId, status);

    return ResponseEntity
        .status(HttpStatus.OK)
        .body(
            new ApiResponse<>(
                "지원서 상태를 업데이트했습니다."
            )
        );
  }
}