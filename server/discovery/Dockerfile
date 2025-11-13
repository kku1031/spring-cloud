# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew :server:discovery:bootJar --no-daemon || exit 1
RUN ls -la /build/server/discovery/build/libs/ || exit 1
RUN cp /build/server/discovery/build/libs/*.jar /build/discovery-server.jar || exit 1

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /build/discovery-server.jar /app/discovery-server.jar
ENTRYPOINT ["java", "-jar", "/app/discovery-server.jar"]
