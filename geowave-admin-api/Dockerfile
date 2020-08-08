FROM maven:3-jdk-8 AS base
WORKDIR /work
COPY pom.xml .
RUN set -ex \
	&& mvn -B dependency:resolve
COPY . .


FROM base AS build
WORKDIR /work
RUN set -ex \
	&& mvn -B clean package


FROM openjdk:8-jre-slim
WORKDIR /runtime
COPY --from=build /work/target/admin-api*.jar admin-api.jar

CMD ["java", "-jar", "admin-api.jar"]
