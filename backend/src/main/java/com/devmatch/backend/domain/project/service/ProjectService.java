package com.devmatch.backend.domain.project.service;

import com.devmatch.backend.domain.project.dto.ProjectCreateRequest;
import com.devmatch.backend.domain.project.dto.ProjectDetailResponse;
import com.devmatch.backend.domain.project.entity.Project;
import com.devmatch.backend.domain.project.mapper.ProjectMapper;
import com.devmatch.backend.domain.project.repository.ProjectRepository;
import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ProjectService {

  private final UserService userService;

  private final ProjectRepository projectRepository;

  public ProjectDetailResponse createProject(ProjectCreateRequest projectCreateRequest) {
    if (!projectCreateRequest.techStack().matches("^([\\w.+#-]+)(, [\\w.+#-]+)*$")) {
      throw new IllegalArgumentException(
          "Tech stack format is invalid. It must be separated by comma and space.");
    }

    User creator = userService.getUser(projectCreateRequest.userId());

    Project project = new Project(
        projectCreateRequest.title(),
        projectCreateRequest.description(),
        projectCreateRequest.techStack(),
        projectCreateRequest.teamSize()
    );

    creator.addProject(project);

    return ProjectMapper.toProjectDetailResponse(projectRepository.save(project));
  }
}