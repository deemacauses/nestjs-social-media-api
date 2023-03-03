import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "./common/guards/roles.guard";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AuthGuard } from "./common/guards";
import { AppModule } from "./app.module";
import { UserService } from "./modules/user/user.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);

  const configService = app.get(ConfigService);
  app.useGlobalGuards(
    new AuthGuard(reflector, jwtService, userService),
    new RolesGuard(new Reflector()),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(configService.get("PORT"));
}
bootstrap();
