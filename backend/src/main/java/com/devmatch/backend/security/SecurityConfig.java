package com.devmatch.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {

  }
}