pipeline {
    agent {
        docker {
            image 'node:26-trixie' // node 26 lts & debian 13 based image with git client
        }
    }
    stages {
        stage('Install Dependencies') {
            when {
                expression {
                    // skip gh-pages branch builds
                    return env.BRANCH_NAME != 'gh-pages';
                }
            }
            steps {
                sh 'npm ci'
            }
        }
        stage('Validate') {
            when {
                expression {
                    return env.BRANCH_NAME != 'gh-pages';
                }
            }
            steps {
                sh 'npm test'
                sh 'npm run build'
                sh 'npm run lint:spec'
            }
        }
        stage('Build & Deploy Branch') {
            environment {
                // 'data team jenkins' credentials
                GH_TOKEN = credentials('b7544320-e084-4912-a1c5-b330585aa8ee')
            }
            when {
                expression {
                    return env.BRANCH_NAME != 'master' && env.BRANCH_NAME != 'gh-pages';
                }
            }
            steps {
                sh 'npm run deploy-branch'
            }
        }
        stage('Build & Deploy Main') {
            environment {
                // 'data team jenkins' credentials
                GH_TOKEN = credentials('b7544320-e084-4912-a1c5-b330585aa8ee')
            }
            when {
                branch 'master'
            }
            steps {
                sh 'npm run deploy'
            }
        }
    }
}
