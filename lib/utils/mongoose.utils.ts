import { Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { delay, retryWhen, scan } from "rxjs/operators";
import { MONGOOSE_CONNECTION, MODEL_KEY } from "../typegoose.constants";

export function getModelToken(model: string, connectionName?: string) {
  if (!!connectionName) {
    return `${getConnectionToken(connectionName)}/${model}`;
  }

  return `${MODEL_KEY}${model}`;
}

export function getConnectionToken(name?: string) {
  return name && name !== MONGOOSE_CONNECTION
    ? `${MONGOOSE_CONNECTION}:${name}`
    : MONGOOSE_CONNECTION;
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger("MongooseModule");
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            logger.error(
              `Unable to connect to the database. Retrying (${
                errorCount + 1
              })...`,
              "",
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}
