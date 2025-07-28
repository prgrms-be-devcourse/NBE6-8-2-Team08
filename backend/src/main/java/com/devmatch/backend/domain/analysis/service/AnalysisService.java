package com.devmatch.backend.domain.analysis.service;

import com.devmatch.backend.domain.analysis.entity.AnalysisResult;
import com.devmatch.backend.domain.analysis.repository.AnalysisRepository;
import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.entity.SkillScore;
import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import com.devmatch.backend.domain.application.repository.ApplicationRepository;
import com.devmatch.backend.domain.project.entity.Project;
import com.devmatch.backend.domain.project.repository.ProjectRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnalysisService {

  private final AnalysisRepository analysisRepository;
  private final ApplicationRepository applicationRepository;
  private final ProjectRepository projectRepository;

  private final ChatModel chatModel;

  @Transactional(readOnly = true)
  public AnalysisResult getAnalysisResult(Long applicationId) {
    return analysisRepository.findByApplicationId(applicationId)
        .orElseThrow(() -> new NoSuchElementException(
            "분석 결과를 찾을 수 없습니다. applicationId: " + applicationId
        ));
  }

  @Transactional
  public AnalysisResult createAnalysisResult(Long applicationId) {
    Application application = applicationRepository.findById(applicationId)
        .orElseThrow(() -> new NoSuchElementException(
            "지원서 " + applicationId + "를 찾을 수 없습니다."
        ));

    Project project = application.getProject();
    List<SkillScore> userSkills = application.getSkillScore();

    StringBuilder prompt = new StringBuilder();
    prompt.append("당신은 전문 분석가입니다. 다음 정보를 바탕으로 지원자의 적합도를 평가해주세요.\n\n");
    prompt.append("프로젝트: ").append(project.getDescription()).append("\n");
    prompt.append("팀 규모: ").append(project.getTeamSize()).append("명\n");
    prompt.append("프로젝트 기간: ").append(project.getDurationWeeks()).append("주\n");
    prompt.append("지원자 기술 역량:\n");

    for (SkillScore skill : userSkills) {
      prompt.append("- ").append(skill.getTechName())
          .append(": ").append(skill.getScore()).append("/10점\n");
    }

    prompt.append("이 지원자가 프로젝트에 적합한지 0-100 사이 소수점 둘째자리로 평가하고, ");
    prompt.append("그 이유를 간단히 설명해주세요.\n");
    prompt.append("형식: 점수|이유 (예: 75.50|React 우수하나 백엔드 부족)");

    String aiResponse = chatModel.call(prompt.toString());

    String[] parts = aiResponse.split("\\|");

    if (parts.length < 2) {
      throw new IllegalArgumentException("AI 응답 형식이 올바르지 않습니다. 응답: " + aiResponse);
    }

    BigDecimal score;
    try {
      score = new BigDecimal(parts[0].trim());

      if (score.compareTo(BigDecimal.ZERO) < 0 || score.compareTo(new BigDecimal("100")) > 0) {
        throw new IllegalArgumentException("점수는 0에서 100 사이여야 합니다. 받은 점수: " + score);
      }
    } catch (NumberFormatException e) {
      throw new IllegalArgumentException("점수 형식이 올바르지 않습니다. 응답: " + parts[0].trim(), e);
    }

    String reason = parts[1].trim();
    if (reason.isEmpty()) {
      throw new IllegalArgumentException("이유가 비어있습니다. 응답: " + aiResponse);
    }

    AnalysisResult result = AnalysisResult.builder()
        .application(application)
        .compatibilityScore(score)
        .compatibilityReason(reason)
        .build();

    return analysisRepository.save(result);
  }

  @Transactional(readOnly = true)
  public String createTeamRoleAssignment(Long projectId) {

    Project project = projectRepository.findById(projectId).orElseThrow(
        () -> new NoSuchElementException("프로젝트를 찾을 수 없습니다. ID: " + projectId)
    );

    List<Application> approvedApplications = applicationRepository.findByProjectAndStatus(
        projectId,
        ApplicationStatus.APPROVED
    );

    if (approvedApplications.size() != project.getTeamSize()) {
      throw new IllegalArgumentException(
          "프로젝트 필요 팀원 수만큼 승인된 지원자가 모이지 않았습니다. " +
              "프로젝트 팀원 수: " + project.getTeamSize() +
              ", 승인된 지원자 수: " + approvedApplications.size()
      );
    }

    StringBuilder prompt = new StringBuilder();

    prompt.append("프로젝트: ").append(project.getDescription()).append("\n");
    prompt.append("팀 규모: ").append(project.getTeamSize()).append("명\n");

    for (Application application : approvedApplications) {
      prompt.append("지원자: ").append(application.getUser().getName()).append("\n");

      for (SkillScore skill : application.getSkillScore()) {
        prompt.append("- ").append(skill.getTechName())
            .append(": ").append(skill.getScore()).append("/10점\n");
      }
      prompt.append("\n");
    }

    prompt.append("각 지원자에게 적합한 역할을 지정해주세요. " +
        "역할은 '프론트엔드 개발자', '백엔드 개발자', '풀스택 개발자', '디자이너', 'QA' 등으로 지정해주세요.\n" +
        "형식: 지원자 이름 - 역할 (예: 홍길동 - 프론트엔드 개발자)\n");

    return chatModel.call(prompt.toString());
  }
}