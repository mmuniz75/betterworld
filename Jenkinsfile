pipeline {
   agent any

   environment {
      AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
      AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
      AWS_DEFAULT_REGION = 'us-east-1'
   }

   stages {
      stage('Checkout') {
         steps {
            git(url: 'https://github.com/mmuniz75/betterworld',
                  branch: "${branch}")
         }
      }
      stage('Install Modules') {
         steps {
            sh 'npm install'
         }
      }
      stage('Compile Typescript') {
         steps {
            sh 'npm run build'
         }
      }
      stage('Sync with AWS') {
         steps {
            sh "aws s3 sync build s3://bestworld.win/ --delete"
         }
      }
   }
}