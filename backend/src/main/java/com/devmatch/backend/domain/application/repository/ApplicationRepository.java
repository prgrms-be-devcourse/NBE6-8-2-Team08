package com.devmatch.backend.domain.application.repository;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

  List<Application> findAllByUserId(Long id);

  List<Application> findByProjectAndStatus(Long projectId, ApplicationStatus status);

}