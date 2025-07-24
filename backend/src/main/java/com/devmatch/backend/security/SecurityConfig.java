package com.devmatch.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


//rest api 통신에 인증인가를
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(
            auth -> auth
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/resource/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
//                .anyRequest().authenticated()
                .anyRequest().permitAll()
        )
        .headers(
            headers -> headers
                .frameOptions(
                    frameOptions ->
                        frameOptions.sameOrigin()
                )
        ).csrf(
            (csrf) -> csrf
                .ignoringRequestMatchers("/h2-console/**")
        );

    return http.build();
  }
}