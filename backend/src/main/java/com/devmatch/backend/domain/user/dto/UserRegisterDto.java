package com.devmatch.backend.domain.user.dto;

import com.devmatch.backend.domain.user.entity.User;

public record UserRegisterDto(
    Long id,
    String name
) {

  public UserRegisterDto(User user) {
    this(user.getId(), user.getName());
  }
}