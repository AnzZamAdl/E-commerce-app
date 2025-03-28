pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

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

        //stage('Remove dependencies'){
            //steps{
                //sh """
                //rm -rf node_modules package-lock.json
                //npm cache clean --force
                //npm install
                //"""
            //}
        //}

        stage('Install Dependencies') {
            steps {
                sh """
                npm install
                npm list @testing-library/jest-dom
                npm list vitest
                """
            }
        }

        //stage('Run Tests') {
            //steps {
                //sh 'npm test -- --run --reporter=verbose'
            //}
        //}

        stage('Build') {
            steps {
                sh 'npm run dev'
            }
        }

        stage('Build Docker Image') {
            steps {
              script{
                withDockerRegistry(credentialsId: 'docker-login', toolName: 'docker') {
                  sh """
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} ${IMAGE_NAME}:latest
                    docker push ${IMAGE_NAME}:latest
                    """
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
