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
            environment {
                GH_TOKEN = credentials('b7544320-e084-4912-a1c5-b330585aa8ee')
            }
            when {
                expression {
                    return env.BRANCH_NAME != 'master' && env.BRANCH_NAME != 'gh-pages';
                }
            }
            steps {
                sh 'env'
                sh 'npm run deploy-branch'
            }
        }
    }
}
