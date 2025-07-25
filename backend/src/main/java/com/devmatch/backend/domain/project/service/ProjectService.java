package com.devmatch.backend.domain.project.service;

import com.devmatch.backend.domain.project.dto.ProjectCreateRequest;
import com.devmatch.backend.domain.project.dto.ProjectDetailResponse;
import com.devmatch.backend.domain.project.entity.Project;
import com.devmatch.backend.domain.project.entity.ProjectStatus;
import com.devmatch.backend.domain.project.mapper.ProjectMapper;
import com.devmatch.backend.domain.project.repository.ProjectRepository;
import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.service.UserService;
import com.devmatch.backend.exception.SameStatusException;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
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
      throw new IllegalArgumentException("기술 스택 기재 형식이 올바르지 않습니다. \", \"로 구분해주세요");
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

    return ProjectMapper.toProjectDetailResponse(project);
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
  public ProjectDetailResponse getProjectDetail(Long projectId) {
    return ProjectMapper.toProjectDetailResponse(getProject(projectId));
  }

  @Transactional
  public ProjectDetailResponse modifyStatus(Long projectId, String status) {
    try {
      Project project = getProject(projectId);
      project.changeStatus(ProjectStatus.valueOf(status));

      return ProjectMapper.toProjectDetailResponse(project);
    } catch (SameStatusException e) {
      throw e;
    } catch (IllegalArgumentException e) {
      String validStatuses = Arrays.stream(ProjectStatus.values())
          .map(Enum::name)
          .collect(Collectors.joining(", "));

      throw new IllegalArgumentException(
          "%s는 유효하지 않은 상태값입니다. 유효한 상태값들은 다음과 같습니다: %s".formatted(status, validStatuses));
    }
  }

  @Transactional
  public ProjectDetailResponse modifyContent(Long id, String content) {
    Project project = getProject(id);
    project.changeContent(content);

    return ProjectMapper.toProjectDetailResponse(project);
  }

  private Project getProject(Long projectId) {
    return projectRepository.findById(projectId)
        .orElseThrow(() -> new NoSuchElementException("조회하려는 프로젝트가 없습니다"));
  }
}
