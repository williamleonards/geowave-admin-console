#
# sidecar-hbase.Dockerfile
#
# This sidecar image runs an instance of the GeoWave HBase server suitable for
# use in developing the GeoWave Admin UI.
#

FROM maven:3-jdk-8 AS build
RUN set -ex \
	&& git clone git://github.com/locationtech/geowave --depth=1 /work \
	&& cd /work \
	&& mvn -B dependency:resolve
RUN set -ex \
	&& cd /work \
	&& mvn -B package -P geowave-tools-singlejar -am -pl deploy -DskipTests -Dfindbugs.skip


FROM openjdk:8-jre-slim
WORKDIR /runtime
COPY --from=build /work/deploy/target/geowave-deploy-*-tools.jar /runtime/geowave-deploy-tools.jar

CMD ["java", "-jar", "geowave-deploy-tools.jar", "hbase", "runserver"]
