package com.devmatch.backend.global.webMvc;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//CORS 설정->시큐리티를 통해 설정하는 게 아니라 스프링 MVC에서 설정함. 시큐리티를 안 쓸 때
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/**")// 모든 경로에 대해 CORS 설정 // 여기 고침 api/** -> /**
        .allowedOrigins("https://cdpn.io", "http://localhost:3000")//프론트 점검할 떄 쓸지도 모르니까
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
        .allowedHeaders("*")
        .allowCredentials(true);
  }
}
