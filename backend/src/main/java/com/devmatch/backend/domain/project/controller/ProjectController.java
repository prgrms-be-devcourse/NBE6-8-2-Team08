package com.devmatch.backend.domain.project.controller;

import static org.springframework.http.HttpStatus.CREATED;

import com.devmatch.backend.domain.project.dto.ProjectCreateRequest;
import com.devmatch.backend.domain.project.dto.ProjectDetailResponse;
import com.devmatch.backend.domain.project.service.ProjectService;
import com.devmatch.backend.global.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/project")
public class ProjectController {

  private final ProjectService projectService;

  @PostMapping
  public ResponseEntity<ApiResponse<ProjectDetailResponse>> create(
      @Valid @RequestBody ProjectCreateRequest projectCreateRequest
  ) {
    return ResponseEntity.status(CREATED).body(new ApiResponse<>(
        "프로젝트 생성 성공", projectService.createProject(projectCreateRequest)));
  }

  @GetMapping
  public ResponseEntity<ApiResponse<List<ProjectDetailResponse>>> getAll() {
    return ResponseEntity.ok()
        .body(new ApiResponse<>("프로젝트 전체 조회 성공", projectService.getProjects()));
  }
}