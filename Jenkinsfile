pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        if (env.BRANCH_NAME == 'master') {
            stage 'Deploy to prod'
            sh 'echo "MASTER?"'
            sh 'env'

        } else {
            stage 'Deploy branch'
            sh 'echo "BRANCH?"'
            sh 'env'
        }
    }
}
