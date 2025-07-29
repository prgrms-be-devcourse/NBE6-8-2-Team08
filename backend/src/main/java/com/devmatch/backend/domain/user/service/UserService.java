package com.devmatch.backend.domain.user.service;

import com.devmatch.backend.domain.user.entity.User;
import com.devmatch.backend.domain.user.repository.UserRepository;
import com.devmatch.backend.exception.ServiceException;
import com.devmatch.backend.global.RsData;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

  private final AuthTokenService authTokenService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;


  @Transactional(readOnly = true)
  public User getUser(Long id) {
    return userRepository.findById(id).orElseThrow(() ->
        new NoSuchElementException("해당 ID 사용자가 없습니다. ID: " + id));
  }

  public User join(String username, String password, String nickname) {
    return join(username, password, nickname, null);
  }

  public User join(String username, String password, String nickname, String profileImgUrl) {
    userRepository
        .findByUsername(username)
        .ifPresent(_member -> {
          throw new ServiceException("409-1", "이미 존재하는 아이디입니다.");
        });

    password = (password != null && !password.isBlank()) ? passwordEncoder.encode(password) : null;

    User user = new User(username, password, nickname, profileImgUrl);

    return userRepository.save(user);
  }

  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public Optional<User> findByApiKey(String apiKey) {
    return userRepository.findByApiKey(apiKey);
  }

  public String genAccessToken(User user) {
    return authTokenService.genAccessToken(user);
  }

  public Map<String, Object> payload(String accessToken) {
    return authTokenService.payload(accessToken);
  }

  public Optional<User> findById(Long id) {
    return userRepository.findById(id);
  }

  public List<User> findAll() {
    return userRepository.findAll();
  }//이거 필요 없을지도

  //이거 로그인 컨트롤러로 처리하던 버전에 쓰던거라 삭제할듯.
  public void checkPassword(User user, String password) {//이거 필요 없을지도
    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new ServiceException("401-1", "비밀번호가 일치하지 않습니다.");
    }
  }

  public RsData<User> modifyOrJoin(String username, String password, String nickname,
      String profileImgUrl) {
    User user = findByUsername(username).orElse(null);

    if (user == null) {
      user = join(username, password, nickname, profileImgUrl);
      return new RsData<>("201-1", "회원가입이 완료되었습니다.", user);
    }

    modify(user, nickname, profileImgUrl);

    return new RsData<>("200-1", "회원 정보가 수정되었습니다.", user);
  }

  private void modify(User user, String nickname, String profileImgUrl) {
    user.modify(nickname, profileImgUrl);
  }
}