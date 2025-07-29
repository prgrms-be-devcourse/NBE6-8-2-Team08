package com.devmatch.backend.domain.user.controller;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.service.ApplicationService;
import com.devmatch.backend.domain.project.dto.ProjectDetailResponse;
import com.devmatch.backend.domain.project.service.ProjectService;
import com.devmatch.backend.global.rq.Rq;
import jakarta.validation.constraints.Min;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  //  private final UserService userService;
  private final Rq rq;
  private final ProjectService projectService;
  private final ApplicationService applicationService;

//  @PostMapping("/register")
//  public ResponseEntity<ApiResponse<UserRegisterDto>> register(@Valid @RequestBody String name) {
//    UserRegisterDto user = userService.join(name, null);//나중에 프로필 이미지 URL 추가 할듯
//
//    return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>("사용자 등록 성공", user));
//  }

  @GetMapping("/{id}/projects")
  public ResponseEntity<List<ProjectDetailResponse>> getProjects(
      @Min(1) @PathVariable Long id) {
    // User user = rq.getActor();
    // user.getId(); // 현재 로그인한 사용자의 ID를 가져옴
    return ResponseEntity.ok().body(projectService.getProjectsByUserId(id));
  }

  @GetMapping("/{id}/applications")
  public ResponseEntity<List<Application>> getApplications(
      @Min(1) @PathVariable Long id) {
    return ResponseEntity.ok()
        .body(applicationService.getApplicationsByUserId(id));
  }
}