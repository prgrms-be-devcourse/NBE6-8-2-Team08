package com.devmatch.backend.domain.user.entity;

import static jakarta.persistence.GenerationType.IDENTITY;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

}