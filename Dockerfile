# ==============================================================================
# Root Dockerfile for Deploying Backend to Render (Default Root Directory = .)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build JAR package using Maven & Eclipse Temurin JDK 21
# ------------------------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy Maven descriptor first to leverage Docker layer caching
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B || true

# Copy source code and build production executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# ------------------------------------------------------------------------------
# Stage 2: Minimal, secure JRE 21 runtime
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for security best practice
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render assigns dynamic PORT environment variable (default fallback to 8080)
ENV PORT=8080
EXPOSE ${PORT}

# Optimize JVM memory allocation for Render containers (especially 512MB RAM free tier)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 -Djava.security.egd=file:/dev/./urandom"

# Launch Spring Boot with dynamic port binding
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
