package com.devmatch.backend.domain.analysis.service;

import com.devmatch.backend.domain.analysis.entity.AnalysisResult;
import com.devmatch.backend.domain.analysis.repository.AnalysisRepository;
import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.application.entity.SkillScore;
import com.devmatch.backend.domain.application.enums.ApplicationStatus;
import com.devmatch.backend.domain.application.repository.ApplicationRepository;
import com.devmatch.backend.domain.project.entity.Project;
import com.devmatch.backend.domain.project.repository.ProjectRepository;
import java.util.List;
import java.util.NoSuchElementException;
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
  private final ProjectRepository projectRepository;

  @Transactional
  public AnalysisResult getOrAnalyzeCompatibility(Long applicationId) {
    return analysisRepository.findByApplicationId(applicationId)
        .orElseGet(() -> {
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
          double score = Double.parseDouble(parts[0].trim());
          String reason = parts[1].trim();

          AnalysisResult result = AnalysisResult.builder()
              .application(application)
              .compatibilityScore(score)
              .compatibilityReason(reason)
              .build();

          return analysisRepository.save(result);
        });
  }

  @Transactional
  public String assignTeamRoles(Long projectId) {

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
