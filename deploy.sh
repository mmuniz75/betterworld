npm run build
aws s3 sync build s3://bestworld.win/ --delete
