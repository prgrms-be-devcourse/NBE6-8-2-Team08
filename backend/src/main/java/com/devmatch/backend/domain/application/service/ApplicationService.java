package com.devmatch.backend.domain.application.service;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.repository.ApplicationRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

  private final ApplicationRepository applicationRepository;

  @Transactional(readOnly = true)
  public Application getApplicationDetail(Long id) {
    return applicationRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("지원서를 찾을 수 없습니다. ID: " + id));
  }
}