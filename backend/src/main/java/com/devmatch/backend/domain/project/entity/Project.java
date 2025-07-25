package com.devmatch.backend.domain.project.entity;

import com.devmatch.backend.domain.user.entity.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "projects")
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

  public Project(
      String title,
      String description,
      String techStack,
      Integer teamSize,
      Integer durationWeeks
  ) {
    this.title = title;
    this.description = description;
    this.techStack = techStack;
    this.teamSize = teamSize;
    this.creator = null;
    this.status = ProjectStatus.RECRUITING;
    this.currentTeamSize = 0;
    this.content = "";
    this.durationWeeks = durationWeeks;
    this.createdAt = LocalDateTime.now();
  }

  public void setUser(User user) {
    this.creator = user;
  }
}