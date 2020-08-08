/*
  task-create-restservices-sidecar.Jenkinsfile
  ============================================

  Purpose:
      Serves as a "sidecar" for GeoWave restservices to facilitate test
      and development.

  Usage:
      Create a job in Jenkins and run it once.
*/

CONTAINER_NAME = 'sidecar-restservices'
IMAGE_TAG      = 'geowave-sidecar-restservices'
NETWORK_NAME   = 'geowave-admin'

node {
    ansiColor {

        stage('Collect sidecar dockerfiles') {
            git(credentialsId: 'github-ssh-key', url: 'git@github.com:venicegeo/geowave-admin-api')
        }

        stage('Build Docker image') {
            sh "docker build -f sidecars/restservices.Dockerfile -t '$IMAGE_TAG' ."
        }

        stage('Start container') {
            sh """
                docker rm -f '$CONTAINER_NAME' 2>/dev/null || true
                docker run \
                    -d \
                    --restart always \
                    --name '$CONTAINER_NAME' \
                    --network '$NETWORK_NAME' \
                    '$IMAGE_TAG'
            """
        }

    }
}
