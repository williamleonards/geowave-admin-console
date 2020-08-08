/*
  task-update-componentsfile.Jenkinsfile
  =====================================

  Purpose:
      Creates the "componentsfile" that contains a list of the compiled
      library dependency versions for GeoWave core.

  Usage:
      Create a job in Jenkins and run it once.
*/

properties([
    pipelineTriggers([
        cron('0 * * * *'),
    ]),
])

node {

    ansiColor {

        stage('Collect generator script') {
            git(credentialsId: 'github-ssh-key', url: 'git@github.com:venicegeo/geowave-admin-api')
        }

        stage('Scan GeoWave core for dependencies') {
            withDockerContainer('maven:3-jdk-8') {
                sh """
                    mkdir -p .mvn
                    echo '-B -Dmaven.repo.local=$WORKSPACE/maven-repo' > .mvn/maven.config
                    
                    rm -rf geowave
                    git clone git://github.com/locationtech/geowave --depth=1
                    ./scripts/create-componentsfile.sh geowave/pom.xml
                """
            }

            archiveArtifacts 'geowave-componentsfile.properties'
        }

        stage('Push componentsfile to API') {
            sh 'docker cp geowave-componentsfile.properties gwa-api:/runtime/componentsfile.properties'
        }

    }
}
