# 1. OpenJDK 17 기반의 이미지를 사용
FROM openjdk:17-jdk-alpine

# 2. 워크 디렉토리 설정 (컨테이너 내에서 작업할 디렉토리)
WORKDIR /app

# 3. 로컬의 target 디렉토리에서 WAR 파일을 컨테이너 내 /app 디렉토리로 복사
COPY target/spring-0.0.1-SNAPSHOT.war /app/donnymoney-spring.war

# 4. 애플리케이션을 실행할 명령어 (컨테이너가 시작될 때 실행)
CMD ["java", "-jar", "/app/donnymoney.war"]


FROM mysql:8.0

# 환경변수 설정
ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=donnymoney

# 필요한 설정 파일이나 스크립트 추가
COPY ./my.cnf /etc/mysql/my.cnf