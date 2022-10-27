pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim'
            args '-p 3000:3000'
        }
    }
    environment {
        GH_TOKEN  = credentials('semantic')
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
