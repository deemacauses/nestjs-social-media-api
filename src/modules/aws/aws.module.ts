import { Module } from "@nestjs/common";

import { AWSCognitoService } from "./aws-cognito.service";

@Module({
  providers: [AWSCognitoService],
  exports: [AWSCognitoService],
})
export class AWSModule {}
