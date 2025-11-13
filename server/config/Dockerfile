# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew :server:config:bootJar --no-daemon || exit 1
RUN ls -la /build/server/config/build/libs/ || exit 1
RUN cp /build/server/config/build/libs/*.jar /build/config-server.jar || exit 1

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /build/config-server.jar /app/config-server.jar
ENTRYPOINT ["java", "-jar", "/app/config-server.jar"]
