import { Logger } from "@nestjs/common";
import { Observable, timer } from "rxjs";
import { retry } from "rxjs/operators";
import {
  MODEL_KEY,
  TYPEGOOSE_DEFAULT_CONNECTION,
} from "../typegoose.constants";

export function getModelToken(model: string, connectionName?: string) {
  if (!!connectionName) {
    return `${getConnectionToken(connectionName)}/${model}`;
  }

  return `${MODEL_KEY}${model}`;
}

export function getConnectionToken(name?: string) {
  return name && name !== TYPEGOOSE_DEFAULT_CONNECTION
    ? `${name}Connection`
    : TYPEGOOSE_DEFAULT_CONNECTION;
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger("TypegooseModule");

  return <T>(source: Observable<T>) => {
    return source.pipe(
      retry({
        count: retryAttempts,
        delay: (error, errorCount) => {
          if (errorCount >= retryAttempts) {
            logger.error(`Exceeded maximum retry attempts.`);
            throw error;
          }
          errorCount++;
          logger.error(
            `Unable to connect to the database. Retrying (${errorCount})...`,
            "",
          );
          return timer(retryDelay);
        },
      }),
    );
  };
}
