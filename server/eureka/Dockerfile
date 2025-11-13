# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew :server:eureka:bootJar --no-daemon || exit 1
RUN ls -la /build/server/eureka/build/libs/ || exit 1
RUN cp /build/server/eureka/build/libs/*.jar /build/eureka-server.jar || exit 1

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /build/eureka-server.jar /app/eureka-server.jar
ENTRYPOINT ["java", "-jar", "/app/eureka-server.jar"]
