package com.web.spring.config;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import com.web.spring.jwt.JWTFilter;
import com.web.spring.jwt.JWTUtil;
import com.web.spring.jwt.LoginFilter;

import com.web.spring.repository.ChildRepository;
import com.web.spring.repository.ParentRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {
    //AuthenticationManager 가 인자로 받을 AuthenticationConfiguraion 객체 생성자
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
	private final ChildRepository childRepository;
	private final ParentRepository parentRepository;

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        log.info("bCryptPasswordEncoder call.....");
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("SecurityFilterChain filterChain(HttpSecurity http) call.....");
       /////////////////////////////////

        //CORS 설정(Cross-Origin Resource Sharing)

        /*http 상의 웹 어플리케이션에서 다른 출처의 리소스에 접근할 수 있는 권한을 부여하는 정책*/
        http.cors((corsCustomizer ->
                        corsCustomizer.configurationSource(new CorsConfigurationSource()
                        {
                            @Override
                            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                                CorsConfiguration configuration = new CorsConfiguration();
                                configuration.setAllowedOrigins(Arrays.asList("http://54.180.195.153", "http://localhost:3000", "http://54.180.195.153:9999"));
//                                configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
//                                configuration.setAllowedOrigins(Arrays.asList("http://52.79.249.178", "http://localhost:3000"));
                                configuration.setAllowedMethods(Collections.singletonList("*"));
                                configuration.setAllowCredentials(true);
                                configuration.setAllowedHeaders(Collections.singletonList("*"));
                                configuration.setMaxAge(3600L);
                                configuration.setExposedHeaders(Collections.singletonList("Authorization"));
                                return configuration;
                            }
                        })));
       ////////////////////////////////////
        //csrf disable
        http.csrf((auth) -> auth.disable()); //csrf공격을 방어하기 위한 토큰 주고 받는 부분을 비활성화!
        
        //Form 로그인 방식 disable -> React, JWT 인증 방식으로 변겨예정
        //disable 를 설정하면 시큐리티의 UsernamePasswordAuthenticationFilter비활성됨.
        http.formLogin((auth) -> auth.disable());
        //http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());
        //경로별 인가 작업
        http.authorizeHttpRequests((auth) ->
                auth
                		//.requestMatchers("/*").permitAll()
                        .requestMatchers("api/login","api/parents/signup/**", "api/children/signup/**", "api/notification/subscribe/**", "api/order/pay/completed/**").permitAll()
                        .requestMatchers("api/swagger-ui", "api/swagger-ui/**","/api/logistics","/api/swagger-config","api/v3/api-docs/**").permitAll()
                        .requestMatchers("api/admin").hasRole("ADMIN")
                        .anyRequest().authenticated()
        );
        System.out.println("request :"+http);
        //세션 설정 - JWT 를 이용 할것이기 때문에 stateless 설정
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        System.out.println("request :"+http);
        //필터 추가 LoginFilter()는 인자를 받음 (AuthenticationManager()
        //메소드에 authenticationConfiguration 객체를 넣어야 함)
       //addFilterAt 은 UsernamePasswordAuthenticationFilter 의 자리에 LoginFilter 가 실행되도록 설정하는 것
        //JWTFilter 등록
        http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
        http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, childRepository,parentRepository), UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }
}