pipeline {
    agent any

    environment {
        IMAGE_NAME = 'anzzamadl/ecommerce-app'
        CONTAINER_NAME = 'ecommerce-container'
        DOCKER_PORT = '8081'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/AnzZamAdl/E-commerce-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
              script{
                withDockerRegistry(credentialsId: 'docker-login', toolName: 'docker') {
                  sh 'docker build -t ${IMAGE_NAME} .'
                }
              }
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
              script{
                withDockerRegistry(credentialsId: 'docker-login', toolName: 'docker') {
                  sh '''
                  docker stop ${CONTAINER_NAME} || true
                  docker rm ${CONTAINER_NAME} || true
                  '''
                }
              }
            }
        }

        stage('Run Docker Container') {
            steps {
              script{
                withDockerRegistry(credentialsId: 'docker-login', toolName: 'docker') {
                  sh 'docker run -d -p ${DOCKER_PORT}:8081 --name ${CONTAINER_NAME} ${IMAGE_NAME}'
                }
              }
            }
        }
    }
}
