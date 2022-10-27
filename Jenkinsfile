pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build & Deploy') {
            when {
                branch 'master'
            }
            steps {
                sh 'echo "MASTER?"'
                sh 'env'
            }
        }
        stage('Branch Build & Deploy') {
            when {
                expression {
                    return env.BRANCH_NAME != 'master';
                }
            }
            steps {
                sh 'echo "BRANCH?"'
                sh 'env'
            }
        }
    }
}
