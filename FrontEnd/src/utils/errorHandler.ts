/**
 * Error handling utility functions for consistent error message extraction
 */

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

/**
 * Extract error message from axios error response
 */
export const getErrorMessage = (error: any): string => {
  // Check if it's an axios error with a response
  if (error.response?.data) {
    const data = error.response.data;
    
    // Check for our standardized error response
    if (typeof data === 'object' && data.message) {
      // For 404 errors, provide more context
      if (error.response.status === 404) {
        return `Not Found: ${data.message}`;
      }
      return data.message;
    }
    
    // Check for plain string response
    if (typeof data === 'string') {
      return data;
    }
  }
  
  // Handle specific HTTP status codes
  if (error.response?.status === 404) {
    return 'The requested resource was not found. It may have been deleted or the URL is incorrect.';
  }
  
  // Check for network errors
  if (error.message) {
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract validation errors from error response
 */
export const getValidationErrors = (error: any): Record<string, string> | null => {
  if (error.response?.data?.validationErrors) {
    return error.response.data.validationErrors;
  }
  return null;
};

/**
 * Check if error is of a specific HTTP status code
 */
export const isErrorStatus = (error: any, status: number): boolean => {
  return error.response?.status === status;
};

/**
 * Check if error is unauthorized (401)
 */
export const isUnauthorized = (error: any): boolean => {
  return isErrorStatus(error, 401);
};

/**
 * Check if error is forbidden (403)
 */
export const isForbidden = (error: any): boolean => {
  return isErrorStatus(error, 403);
};

/**
 * Check if error is not found (404)
 */
export const isNotFound = (error: any): boolean => {
  return isErrorStatus(error, 404);
};

/**
 * Check if error is conflict (409)
 */
export const isConflict = (error: any): boolean => {
  return isErrorStatus(error, 409);
};

/**
 * Check if error is validation error (400)
 */
export const isValidationError = (error: any): boolean => {
  return isErrorStatus(error, 400);
};
