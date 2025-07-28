package com.devmatch.backend.domain.application.service;

import com.devmatch.backend.domain.application.dto.request.ApplicationCreateRequestDto;
import com.devmatch.backend.domain.application.dto.request.ApplicationStatusUpdateRequestDto;
import com.devmatch.backend.domain.application.dto.response.ApplicationDetailResponseDto;
import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.repository.ApplicationRepository;
import com.devmatch.backend.domain.project.entity.Project;
import com.devmatch.backend.domain.project.repository.ProjectRepository;
import com.devmatch.backend.domain.project.service.ProjectService;
import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.service.UserService;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

  private final ApplicationRepository applicationRepository;
  private final ProjectRepository projectRepository;
  private final UserService userService;
  private final ProjectService projectService;

  // 지원서 작성 로직
  @Transactional
  public ApplicationDetailResponseDto createApplication(ApplicationCreateRequestDto reqBody) {
    User user = userService.getUser(reqBody.userId());
    Project project = projectService.getProject(reqBody.projectId());

    Application application = Application.builder()
        .user(user)
        .project(project)
        .build();

    return new ApplicationDetailResponseDto(applicationRepository.save(application));
  }

  // 지원서 전체 조회 로직
  @Transactional(readOnly = true)
  public List<ApplicationDetailResponseDto> getApplications(Long userId) {
    return getApplicationsByUserId(userId).stream()
        .map(ApplicationDetailResponseDto::new)
        .collect(Collectors.toList());
  }

  // 지원서 상세 조회 로직
  @Transactional(readOnly = true)
  public ApplicationDetailResponseDto getApplicationDetail(Long id) {
    return new ApplicationDetailResponseDto(getApplicationByApplicationId(id));
  }

  // 지원서 삭제 로직
  @Transactional
  public void deleteApplication(Long id) {
    Application application = getApplicationByApplicationId(id);

    applicationRepository.delete(application); // DB 에서 삭제
  }

  // 지원서 상태 업데이트 로직
  @Transactional
  public void updateApplicationStatus(Long id, ApplicationStatusUpdateRequestDto reqBody) {
    Application application = getApplicationByApplicationId(id);

    // 엔티티가 영속성 컨텍스트 안에 있으면, 트랜잭션 종료 시점에 자동으로 DB에 반영됩니다 (Dirty Checking)
    application.changeStatus(reqBody.status()); // 상태 업데이트
  }

  // 사용자 ID로 사용자가 작성한 모든 지원서들을 가져오는 함수
  public List<Application> getApplicationsByUserId(Long id) {
    return applicationRepository.findAllByUserId(id);
  }

  // 지원서 ID로 지원서를 가져오는 함수
  private Application getApplicationByApplicationId(Long id) {
    return applicationRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("지원서를 찾을 수 없습니다. ID: " + id));
  }
}