#!/bin/bash -e

if [ "$#" == 0 ]; then
	echo "usage: $(basename $0) /path/to/geowave/parent/pom.xml"
	exit 1
fi

GEOWAVE_PARENT_POM="$1"
RAW_DEPENDENCIES="$PWD/raw-dependencies.txt"
PROPERTIES_FILE=geowave-componentsfile.properties


COMPONENT_PATTERNS='
	accumulo-core
	:avro:
	aws-java-sdk-core
	bigtable-hbase
	commons-vfs2
	gs-main
	gt-main
	:guava:
	hadoop-common
	hbase-common
	:httpclient:
	httpcore
	:jackson-core:
	:jackson-core-asl:
	jetty-server
	kafka-clients
	scala-library
	spark-core
	spring-security-core
	:zookeeper:
'


if [ ! -f "$GEOWAVE_PARENT_POM" ]; then
	echo "error: could not find GeoWave parent POM (file=$GEOWAVE_PARENT_POM)"
	exit 1
fi


echo -e "\nCollecting raw dependency list from Maven (pom=$GEOWAVE_PARENT_POM, file=$RAW_DEPENDENCIES)...\n"

mvn dependency:list \
	-f "$GEOWAVE_PARENT_POM" \
	-DappendOutput=true \
	-DincludeScope=runtime \
	-Dsort=true \
	-DoutputFile="$RAW_DEPENDENCIES"


echo -e "\nWriting '$PROPERTIES_FILE'...\n"

echo "@last-update=$(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee "$PROPERTIES_FILE"

for component_pattern in $COMPONENT_PATTERNS; do
	line=$(grep -E "$component_pattern" "$RAW_DEPENDENCIES" | grep -v ':tests:' | awk -F: '{ print $2 "=" $4 }' | sort | uniq)

	if [ -z "$line" ]; then
		echo "error: could not find '$component_pattern' in dependency list (file=$RAW_DEPENDENCIES)"
		exit 1
	fi

	# Clean up names
	line=$(sed -E 's/^bigtable-hbase.*=/bigtable-hbase=/' <<< "$line")
	line=$(sed -E 's/^gs-main=/geoserver=/' <<< "$line")
	line=$(sed -E 's/^gt-main=/geotools=/' <<< "$line")
	line=$(sed -E 's/^scala-library=/scala=/' <<< "$line")
	line=$(sed -E 's/^spark-core_.*=/spark-core=/' <<< "$line")

	echo "$line" | tee -a "$PROPERTIES_FILE"
done


echo -e "\nCleaning up...\n"
rm "$RAW_DEPENDENCIES"
