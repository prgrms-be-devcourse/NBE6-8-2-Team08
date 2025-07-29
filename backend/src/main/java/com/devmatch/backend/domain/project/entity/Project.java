package com.devmatch.backend.domain.project.entity;

import static jakarta.persistence.FetchType.LAZY;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.exception.SameStatusException;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(
    name = "projects",
    indexes = {@Index(name = "idx_creator_id", columnList = "creator_id")}
)
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;
  private String techStack;

  private Integer teamSize;
  private Integer currentTeamSize;

  @ManyToOne
  @JoinColumn(name = "creator_id")
  private User creator;

  @Enumerated(EnumType.STRING)
  private ProjectStatus status;

  private String content;
  private Integer durationWeeks;
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "project", fetch = LAZY, orphanRemoval = true)
  private List<Application> applications;

  public Project(
      String title,
      String description,
      String techStack,
      Integer teamSize,
      User creator,
      Integer durationWeeks
  ) {
    this.title = title;
    this.description = description;
    this.techStack = techStack;
    this.teamSize = teamSize;
    this.creator = creator;
    this.status = ProjectStatus.RECRUITING;
    this.currentTeamSize = 0;
    this.content = "";
    this.durationWeeks = durationWeeks;
    this.createdAt = LocalDateTime.now();
  }

  public void changeStatus(ProjectStatus newStatus) {
    if (newStatus == this.status) {
      throw new SameStatusException(
          "현재 상태(%s)와 동일한 상태(%s)로 변경할 수 없습니다".formatted(this.status, newStatus));
    }

    this.status = newStatus;
  }

  public void changeContent(String content) {
    this.content = content;
  }
}
