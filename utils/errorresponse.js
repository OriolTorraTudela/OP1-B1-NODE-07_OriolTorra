/**
 * Classe personalitzada per errors amb status code
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Mantenir stack trace correcte
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;