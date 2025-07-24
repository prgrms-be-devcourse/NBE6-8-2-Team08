package com.devmatch.backend.domain.user.entity;

import static jakarta.persistence.CascadeType.PERSIST;
import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

import com.devmatch.backend.domain.application.entity.Application;
import com.devmatch.backend.domain.project.entity.Project;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // 테이블 이름을 명시적으로 지정
@Getter
@NoArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = IDENTITY)
  private Long id;

  @NotNull
  @Size(min = 1, max = 50, message = "사용자 이름은 1자 이상 50자 이하이어야 합니다.")
  private String name;

  public User(String name) {
    this.name = name;
  }

  //Project 연관관계 설정
  //cascade REMOVE는 탈퇴기능이 없으니 사용하지 않음
  //따로 repo 접근 안해도 여기서 접근.
  @OneToMany(mappedBy = "user", fetch = LAZY, cascade = {PERSIST}, orphanRemoval = true)
  private List<Project> projects = new ArrayList<>();

  @OneToMany(mappedBy = "user", fetch = LAZY, cascade = {PERSIST}, orphanRemoval = true)
  private List<Application> applications = new ArrayList<>();

  //연관관계를 지키기 위해서 꼭 user 객체 생성 후 호출
  public void addProject(Project project) {
    projects.add(project);
    project.setUser(this); // 양방향 연관관계 설정
  }

  public void addApplication(Application application) {
    applications.add(application);
    application.setUser(this); // 양방향 연관관계 설정
  }
}