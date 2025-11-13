# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew :service:soccer:bootJar --no-daemon || exit 1
RUN ls -la /build/service/soccer/build/libs/ || exit 1
RUN cp /build/service/soccer/build/libs/*.jar /build/soccer-service.jar || exit 1

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /build/soccer-service.jar /app/soccer-service.jar
ENTRYPOINT ["java", "-jar", "/app/soccer-service.jar"]
