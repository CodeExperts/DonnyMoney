package com.web.spring.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import 
org.springframework.web.servlet.config.annotation.CorsRegistry;
import 
org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import 
org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
* WebMvcConfigurer 를 이용해서 @CrossOrigin 글로벌 설정
* */
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {
	

	@Value("${jwt.response.header}")
	private String jwtHeader;
	
  @Override
  public void addCorsMappings(CorsRegistry registry) {
     registry.addMapping("/api/**")
     .allowedOrigins("http://52.79.249.178", "http://localhost:3000", "http://52.79.249.178:9999")
     .allowedOriginPatterns("http://52.79.249.178", "http://localhost:3000", "http://52.79.249.178:9999") // “*“같은 와일드카드를 사용
     .exposedHeaders(jwtHeader) // 'Authorization' 헤더 값을 받아온다
     .allowedMethods("OPTIONS","GET","POST","PUT","DELETE")
     .allowCredentials(true);
  }
  
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
      registry.addResourceHandler("/assets/**")
              .addResourceLocations("classpath:/assets/");
  }
}