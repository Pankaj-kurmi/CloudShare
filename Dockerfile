FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw

RUN ./mvnw -DskipTests dependency:go-offline

COPY src src

RUN ./mvnw -DskipTests package \
    && JAR_FILE=$(find target -maxdepth 1 -name '*.jar' ! -name '*original*' | head -n 1) \
    && cp "$JAR_FILE" /workspace/app.jar

FROM eclipse-temurin:21-jre-jammy AS runtime

WORKDIR /app

ENV JAVA_OPTS=""

COPY --from=build /workspace/app.jar /app/app.jar

EXPOSE 5050

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]