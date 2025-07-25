package com.devmatch.backend.domain.project.service;

import com.devmatch.backend.domain.project.dto.ProjectCreateRequest;
import com.devmatch.backend.domain.project.dto.ProjectDetailResponse;
import com.devmatch.backend.domain.project.entity.Project;
import com.devmatch.backend.domain.project.mapper.ProjectMapper;
import com.devmatch.backend.domain.project.repository.ProjectRepository;
import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.service.UserService;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ProjectService {

  private final UserService userService;

  private final ProjectRepository projectRepository;

  @Transactional
  public ProjectDetailResponse createProject(ProjectCreateRequest projectCreateRequest) {
    if (!projectCreateRequest.techStack().matches("^([\\w.+#-]+)(, [\\w.+#-]+)*$")) {
      throw new IllegalArgumentException(
          "기술 스택 기재 형식이 올바르지 않습니다. \", \"로 구분해주세요");
    }

    User creator = userService.getUser(projectCreateRequest.userId());

    Project project = new Project(
        projectCreateRequest.title(),
        projectCreateRequest.description(),
        projectCreateRequest.techStack(),
        projectCreateRequest.teamSize(),
        projectCreateRequest.durationWeeks()
    );

    creator.addProject(project);

    return ProjectMapper.toProjectDetailResponse(projectRepository.save(project));
  }

  @Transactional(readOnly = true)
  public List<ProjectDetailResponse> getProjects() {
    return projectRepository.findAll()
        .stream()
        .map(ProjectMapper::toProjectDetailResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ProjectDetailResponse> getProjectsByUserId(long userId) {
    return projectRepository.findAllByCreatorId(userId)
        .stream()
        .map(ProjectMapper::toProjectDetailResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public ProjectDetailResponse getProject(Long projectId) {
    return ProjectMapper.toProjectDetailResponse(projectRepository.findById(projectId)
        .orElseThrow(() -> new NoSuchElementException("조회하려는 프로젝트가 없습니다")));
  }
}