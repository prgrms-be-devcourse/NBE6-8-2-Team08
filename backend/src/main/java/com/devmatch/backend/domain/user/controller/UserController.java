package com.devmatch.backend.domain.user.controller;

import com.devmatch.backend.domain.application.dto.response.ApplicationDetailResponseDto;
import com.devmatch.backend.domain.application.service.ApplicationService;
import com.devmatch.backend.domain.project.dto.ProjectDetailResponse;
import com.devmatch.backend.domain.project.service.ProjectService;
import com.devmatch.backend.domain.user.dto.UserRegisterDto;
import com.devmatch.backend.domain.user.service.UserService;
import com.devmatch.backend.global.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final ProjectService projectService;
  private final ApplicationService applicationService;

  @PostMapping("/register")
  public ResponseEntity<ApiResponse<UserRegisterDto>> register(@Valid @RequestBody String name) {
    UserRegisterDto user = userService.save(name);

    return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>("사용자 등록 성공", user));
  }

  @GetMapping("/{id}/projects")
  public ResponseEntity<List<ProjectDetailResponse>> findProjectsById(@PathVariable Long id) {
    return ResponseEntity.status(HttpStatus.OK).body(projectService.getProjectsByUserId(id));
  }

  @GetMapping("/{id}/applications")
  public ResponseEntity<List<ApplicationDetailResponseDto>> findApplicationsById(@PathVariable Long id) {
    return ResponseEntity.status(HttpStatus.OK)
        .body(applicationService.getApplicationsByUserId(id));
  }
}