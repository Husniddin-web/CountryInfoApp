import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';
    let error = 'InternalError';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      error = (response as any).error || exception.name;
      message = (response as any).message || response;
    } else if (exception instanceof MongooseError.ValidationError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      error = 'ValidationError';
      message = Object.values(exception.errors).map((err) => err.message);
    } else if (exception instanceof MongooseError.CastError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      error = 'CastError';
      message = `Invalid format for field ${exception.path}. Expected a valid ${exception.kind}.`;
    } else if (exception.code === 11000) {
      httpStatus = HttpStatus.CONFLICT;
      error = 'UniqueConstraintViolation';
      const field = Object.keys(exception.keyValue).join(', ');
      message = `A record with the value for field '${field}' already exists.`;
    } else if (exception instanceof MongooseError.DocumentNotFoundError) {
      httpStatus = HttpStatus.NOT_FOUND;
      error = 'RecordNotFound';
      message = 'The requested record was not found.';
    } else if (exception instanceof Error) {
      error = exception.name;
      message = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    this.logger.error(
      `[${httpStatus}] ${request.method} ${responseBody.path} - Error: ${error} - Message: ${JSON.stringify(message)}`
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
