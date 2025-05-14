export class ApiResponse<T> {
    constructor(
      public message: string,
      public statusCode: number,
      public data: T | null = null,
      public error: string | null = null
    ) {}
  }