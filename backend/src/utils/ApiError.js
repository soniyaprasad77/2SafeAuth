class ApiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      errors = [],
      statck = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.message = message;
      this.success = false;
      this.errors = errors;
  
      if (statck) {
        this.stack = statck;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
    toJSON() {
      return {
        statusCode: this.statusCode,
        message: this.message,
        success: this.success,
        errors: this.errors,
        data: this.data,
      };
    }
  }
  
  export { ApiError };