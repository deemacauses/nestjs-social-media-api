import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

import { DATABASE_PROVIDER } from "./../constants";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject(DATABASE_PROVIDER)
    private readonly sequelizeInstance: Sequelize,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const transaction: Transaction = await this.sequelizeInstance.transaction({
      logging: true,
    });
    req.transaction = transaction;
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      }),
      catchError(async (error) => {
        await transaction.rollback();
        throw error;
      }),
    );
  }
}
