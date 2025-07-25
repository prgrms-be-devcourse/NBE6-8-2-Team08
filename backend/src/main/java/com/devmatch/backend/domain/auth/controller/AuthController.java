package com.devmatch.backend.domain.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @PostMapping("/login")
  public String login() {
    return "login";
  }

  @PostMapping("/logout")
  public String logout() {
    return "logout";
  }

}