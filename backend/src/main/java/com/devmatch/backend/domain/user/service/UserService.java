package com.devmatch.backend.domain.user.service;

import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public User save(String name) {
    User user = new User(name);
    return userRepository.save(user);
  }

  @Transactional(readOnly = true)
  public User getUser(long id) {
    return userRepository.findById(id).orElseThrow(() ->
        new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + id));
  }
}