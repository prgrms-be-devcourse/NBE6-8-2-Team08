package com.devmatch.backend.domain.user.controller;

import com.devmatch.backend.domain.application.entity.Application;
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
import org.springframework.web.bind.annotation.*;

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
  public List<ProjectDetailResponse> findProjectsById(@PathVariable long id) {
    return projectService.getProjectsByUserId(id);
  }

  @GetMapping("/{id}/applications")
  public List<Application> findApplicationsById(@PathVariable long id) {
    return applicationService.getApplicationsByUserId(id);
  }
}