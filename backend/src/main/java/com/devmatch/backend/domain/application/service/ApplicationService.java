package com.devmatch.backend.domain.application.service;

import com.devmatch.backend.domain.application.dto.response.ApplicationDetailResponseDto;
import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.repository.ApplicationRepository;
import com.devmatch.backend.domain.user.repository.UserRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

  private final ApplicationRepository applicationRepository;
  private final UserRepository userRepository;

  // 지원서 상세 조회 로직
  @Transactional(readOnly = true)
  public ApplicationDetailResponseDto getApplicationDetail(Long id) {
    return new ApplicationDetailResponseDto(getApplicationByApplicationId(id));
  }

  // 지원서 삭제 로직
  @Transactional
  public void deleteApplication(Long id) {
    Application application = getApplicationByApplicationId(id);

    // orphanRemoval = true 로 인해 컬렉션에서 제거하면 자동으로 DB 에서도 삭제됨.
    application.getUser().removeApplication(application); // 컬렉션에서 제거

    applicationRepository.delete(application); // DB 에서 삭제
  }

  // 지원서 ID로 지원서를 가져오는 함수
  private Application getApplicationByApplicationId(Long id) {
    return applicationRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("지원서를 찾을 수 없습니다. ID: " + id));
  }

  // 사용자 ID로 지원서를 가져오는 함수
  private Application getApplicationByUserId(Long id) {
    return applicationRepository.findApplicationByUserId(id)
        .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + id));
  }
}