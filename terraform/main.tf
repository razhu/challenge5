provider "aws" {
  region = "us-east-1"
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = "image-resizer-bucket"
}

module "lambda" {
  source           = "./modules/lambda"
  bucket_name      = module.s3.bucket_name
  function_name    = "image-resizer-function"
  runtime          = "nodejs18.x"
  handler          = "index.handler"
  source_path      = "../backend/dist"
}
