#
# sidecar-restservices.Dockerfile
#
# This sidecar image runs an instance of the GeoWave restservices suitable for
# use in developing the GeoWave Admin UI.
#

FROM maven:3-jdk-8 AS build
RUN set -ex \
	&& git clone git://github.com/locationtech/geowave --depth=1 /work \
	&& cd /work \
	&& mvn -B dependency:resolve
RUN set -ex \
	&& cd /work/services/rest \
	&& mvn -B package -P rest-services-war -DskipTests -Dfindbugs.skip


FROM tomcat:9-jre8-slim
RUN set -ex \
	&& rm -rf /usr/local/tomcat/webapps \
	&& mkdir /usr/local/tomcat/webapps
COPY --from=build /work/services/rest/target/geowave-service-rest-*-restservices.war /usr/local/tomcat/webapps/ROOT.war
ENV JPDA_OPTS '-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005'
CMD ["catalina.sh", "jpda", "run"]
