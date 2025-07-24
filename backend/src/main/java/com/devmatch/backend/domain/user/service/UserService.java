package com.devmatch.backend.domain.user.service;

import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.repository.UserRepository;
import java.util.Optional;
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
  public Optional<User> findById(long id) {
    return userRepository.findById(id);
  }
}