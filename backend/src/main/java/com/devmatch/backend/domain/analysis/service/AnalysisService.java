package com.devmatch.backend.domain.analysis.service;

import com.devmatch.backend.domain.analysis.entity.AnalysisResult;
import com.devmatch.backend.domain.analysis.repository.AnalysisRepository;
import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.repository.ApplicationRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

  private final AnalysisRepository analysisRepository;
  private final ChatModel chatModel;
  private final ApplicationRepository applicationRepository;

  public AnalysisResult getAnalysisResult(Long applicationId) {
    return analysisRepository.findByApplicationId(applicationId)
        .orElseThrow(() -> new IllegalArgumentException(
            "지원서 " + applicationId + "에 대한 분석 결과가 존재하지 않습니다."
        ));
  }

  @Transactional
  public AnalysisResult analyzeCompatibility(Long applicationId) {
    Application application = applicationRepository.findById(applicationId)
        .orElseThrow(() -> new IllegalArgumentException(
            "지원서 " + applicationId + "를 찾을 수 없습니다."
        ));

    Optional<AnalysisResult> existingResult = analysisRepository.findByApplicationId(applicationId);

    if (existingResult.isPresent()) {
      return existingResult.get();
    }

    String prompt = createCompatibilityPrompt(application);

    String aiResponse = chatModel.call(prompt);

    double score = parseCompatibilityScore(aiResponse);
    String reason = parseCompatibilityReason(aiResponse);

    AnalysisResult result = AnalysisResult.builder()
        .application(application)
        .compatibilityScore(score)
        .compatibilityReason(reason)
        .build();

    return analysisRepository.save(result);
  }
}