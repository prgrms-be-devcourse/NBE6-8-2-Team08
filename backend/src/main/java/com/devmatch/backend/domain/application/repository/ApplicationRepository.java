package com.devmatch.backend.domain.application.repository;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

  Optional<Application> findByProjectAndStatus(Long projectId, ApplicationStatus status);

}