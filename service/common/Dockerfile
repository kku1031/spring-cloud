# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew :service:common:bootJar --no-daemon || exit 1
RUN ls -la /build/service/common/build/libs/ || exit 1
RUN cp /build/service/common/build/libs/*.jar /build/common-service.jar || exit 1

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /build/common-service.jar /app/common-service.jar
ENTRYPOINT ["java", "-jar", "/app/common-service.jar"]
