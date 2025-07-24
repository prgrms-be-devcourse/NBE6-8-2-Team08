package com.devmatch.backend.domain.user.service;

import com.devmatch.backend.domain.user.dto.UserRegisterDto;
import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.repository.UserRepository;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public UserRegisterDto save(String name) {
    User user = userRepository.save(new User(name));
    return new UserRegisterDto(user);
  }

  @Transactional(readOnly = true)
  public User getUser(long id) {
    return userRepository.findById(id).orElseThrow(() ->
        new NoSuchElementException("해당 ID 사용자가 없습니다. ID: " + id));
  }
}