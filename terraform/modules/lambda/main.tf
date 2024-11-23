resource "aws_lambda_function" "this" {
  function_name = var.function_name
  runtime       = var.runtime
  handler       = var.handler
  role          = aws_iam_role.lambda_role.arn
  s3_bucket     = var.bucket_name
  s3_key        = "${var.function_name}.zip"

  environment {
    variables = {
      BUCKET_NAME = var.bucket_name
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:*"]
        Effect   = "Allow"
        Resource = ["arn:aws:s3:::${var.bucket_name}/*"]
      },
      {
        Action   = ["logs:*"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}
