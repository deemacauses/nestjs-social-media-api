import { Injectable } from "@nestjs/common";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { AuthLoginUserDTO, AuthRegisterUserDTO } from "./dto";

@Injectable()
export class AWSCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(authRegisterUserDto: AuthRegisterUserDTO) {
    const { name, email, password } = authRegisterUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        name,
        password,
        [
          new CognitoUserAttribute({
            Name: "email",
            Value: email,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            console.log(result);
            resolve(result.user);
          }
        },
      );
    });
  }

  confirmUser(user: { username: string; confirmationCode: string }) {
    const { username, confirmationCode } = user;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(
        confirmationCode,
        true,
        function (err, result) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDTO) {
    const { username, password } = authLoginUserDto;
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          console.log(err);
          reject(err);
        },
      });
    });
  }
}
