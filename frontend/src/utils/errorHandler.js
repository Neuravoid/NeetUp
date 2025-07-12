/**
 * Safely extracts an error message from various error formats
 * Works with string errors, objects with detail/message properties, or arrays
 * 
 * @param {any} error - The error to extract a message from
 * @returns {string} - A human-readable error message
 */
export const getErrorMessage = (error) => {
  if (!error) return '';
  
  // If it's already a string, return it
  if (typeof error === 'string') return error;
  
  // Handle error objects with common properties
  if (typeof error === 'object') {
    // Handle FastAPI style errors with detail property
    if (error.detail) {
      return typeof error.detail === 'string' 
        ? error.detail 
        : JSON.stringify(error.detail);
    }
    
    // Handle standard JS Error objects with message property
    if (error.message) return error.message;
    
    // Handle arrays of errors (e.g., validation errors)
    if (Array.isArray(error)) {
      return error.map(getErrorMessage).join(', ');
    }
    
    // Try to stringify the object
    try {
      return JSON.stringify(error);
    } catch (e) {
      // If all else fails
      return 'An unknown error occurred';
    }
  }
  
  // If it's something else entirely
  return 'An unexpected error occurred';
};
