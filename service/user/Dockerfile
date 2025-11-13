# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew :service:user:bootJar --no-daemon || exit 1
RUN ls -la /build/service/user/build/libs/ || exit 1
RUN cp /build/service/user/build/libs/*.jar /build/user-service.jar || exit 1

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /build/user-service.jar /app/user-service.jar
ENTRYPOINT ["java", "-jar", "/app/user-service.jar"]
