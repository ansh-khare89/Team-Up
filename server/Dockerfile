# Multi-stage build for Spring Boot application
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/target/team-up-server-1.0.0.jar app.jar

# Expose port
EXPOSE 5000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
