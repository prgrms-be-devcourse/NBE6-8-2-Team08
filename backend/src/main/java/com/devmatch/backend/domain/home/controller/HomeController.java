package com.devmatch.backend.domain.home.controller;

import static java.net.InetAddress.getLocalHost;
import static org.springframework.http.MediaType.TEXT_HTML_VALUE;

import java.net.InetAddress;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

  @SneakyThrows
  @GetMapping(produces = TEXT_HTML_VALUE)
  public String main() {
    InetAddress localHost = getLocalHost();
    return """
        <h1>API 서버</h1>
        <p>Host Name: %s</p>
        <p>Host Address: %s</p>
        <div>
            <a href="http://localhost:8080/oauth2/authorization/kakao"
               className="p-2 rounded hover:bg-gray-100">  카카오 로그인  </a>
            <a href="http://localhost:8080/oauth2/authorization/google"
               className="p-2 rounded hover:bg-gray-100">  구글 로그인  </a>
            <a href="http://localhost:8080/oauth2/authorization/naver"
               className="p-2 rounded hover:bg-gray-100">  네이버 로그인  </a>
        </div>
        """.formatted(localHost.getHostName(), localHost.getHostAddress());

  }
}
