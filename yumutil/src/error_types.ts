/**
 * Error classification system to distinguish between different types of errors
 * when making requests through proxies to target websites.
 */

export enum ErrorType {
  PROXY_ERROR = 'PROXY_ERROR',
  TARGET_WEBSITE_ERROR = 'TARGET_WEBSITE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ClassifiedError {
  type: ErrorType;
  message: string;
  originalError: any;
  proxyUsed?: string;
  targetUrl?: string;
  httpStatus?: number;
  isRetryable: boolean;
}

/**
 * Classifies an error based on its characteristics
 */
export function classifyError(
  error: any,
  proxyUsed?: string,
  targetUrl?: string,
  httpStatus?: number
): ClassifiedError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';

  // Check for proxy-specific errors
  if (isProxyError(error, errorMessage)) {
    return {
      type: ErrorType.PROXY_ERROR,
      message: `Proxy error: ${errorMessage}`,
      originalError: error,
      proxyUsed,
      targetUrl,
      httpStatus,
      isRetryable: true
    };
  }

  // Check for timeout errors
  if (isTimeoutError(error, errorMessage)) {
    return {
      type: ErrorType.TIMEOUT_ERROR,
      message: `Timeout error: ${errorMessage}`,
      originalError: error,
      proxyUsed,
      targetUrl,
      httpStatus,
      isRetryable: true
    };
  }

  // Check for authentication errors
  if (isAuthenticationError(error, errorMessage, httpStatus)) {
    return {
      type: ErrorType.AUTHENTICATION_ERROR,
      message: `Authentication error: ${errorMessage}`,
      originalError: error,
      proxyUsed,
      targetUrl,
      httpStatus,
      isRetryable: false
    };
  }

  // Check for rate limit errors
  if (isRateLimitError(error, errorMessage, httpStatus)) {
    return {
      type: ErrorType.RATE_LIMIT_ERROR,
      message: `Rate limit error: ${errorMessage}`,
      originalError: error,
      proxyUsed,
      targetUrl,
      httpStatus,
      isRetryable: true
    };
  }

  // Check for target website errors based on HTTP status
  if (isTargetWebsiteError(httpStatus)) {
    return {
      type: ErrorType.TARGET_WEBSITE_ERROR,
      message: `Target website error (HTTP ${httpStatus}): ${errorMessage}`,
      originalError: error,
      proxyUsed,
      targetUrl,
      httpStatus,
      isRetryable: false
    };
  }

  // Check for network errors
  if (isNetworkError(error, errorMessage)) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: `Network error: ${errorMessage}`,
      originalError: error,
      proxyUsed,
      targetUrl,
      httpStatus,
      isRetryable: true
    };
  }

  // Default to unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: `Unknown error: ${errorMessage}`,
    originalError: error,
    proxyUsed,
    targetUrl,
    httpStatus,
    isRetryable: false
  };
}

/**
 * Determines if an error is proxy-related
 */
function isProxyError(error: any, message: string): boolean {
  const proxyErrorPatterns = [
    /proxy/i,
    /connection refused/i,
    /ECONNREFUSED/i,
    /ENOTFOUND/i,
    /EHOSTUNREACH/i,
    /ETIMEDOUT/i,
    /proxy authentication/i,
    /407/i, // Proxy Authentication Required
    /502 Bad Gateway/i,
    /503 Service Unavailable/i,
    /504 Gateway Timeout/i,
    /connection reset/i,
    /socket hang up/i
  ];

  return proxyErrorPatterns.some(pattern => pattern.test(message));
}

/**
 * Determines if an error is a timeout error
 */
function isTimeoutError(error: any, message: string): boolean {
  const timeoutPatterns = [
    /timeout/i,
    /ETIMEDOUT/i,
    /aborted/i,
    /signal/i
  ];

  return timeoutPatterns.some(pattern => pattern.test(message)) ||
    error?.name === 'AbortError';
}

/**
 * Determines if an error is an authentication error
 */
function isAuthenticationError(error: any, message: string, httpStatus?: number): boolean {
  return httpStatus === 401 ||
    httpStatus === 403 ||
    /unauthorized/i.test(message) ||
    /forbidden/i.test(message) ||
    /invalid.*token/i.test(message) ||
    /authentication.*failed/i.test(message);
}

/**
 * Determines if an error is a rate limit error
 */
function isRateLimitError(error: any, message: string, httpStatus?: number): boolean {
  return httpStatus === 429 ||
    /rate.?limit/i.test(message) ||
    /too many requests/i.test(message) ||
    /throttle/i.test(message);
}

/**
 * Determines if an error is a target website error based on HTTP status
 */
function isTargetWebsiteError(httpStatus?: number): boolean {
  if (!httpStatus) return false;

  // 4xx client errors (except 401, 403, 429 which are handled separately)
  if (httpStatus >= 400 && httpStatus < 500 && ![401, 403, 429].includes(httpStatus)) {
    return true;
  }

  // 5xx server errors (except 502, 503, 504 which might be proxy-related)
  if (httpStatus >= 500 && ![502, 503, 504].includes(httpStatus)) {
    return true;
  }

  return false;
}

/**
 * Determines if an error is a network error
 */
function isNetworkError(error: any, message: string): boolean {
  const networkErrorPatterns = [
    /network/i,
    /dns/i,
    /ENOTFOUND/i,
    /EHOSTUNREACH/i,
    /ECONNRESET/i,
    /socket/i,
    /connection/i
  ];

  return networkErrorPatterns.some(pattern => pattern.test(message)) &&
    !isProxyError(error, message);
}

/**
 * Logs a classified error with appropriate context
 */
export function logClassifiedError(classifiedError: ClassifiedError, context?: string): void {
  const prefix = context ? `[${context}]` : '';
  const proxyInfo = classifiedError.proxyUsed ? ` (proxy: ${classifiedError.proxyUsed})` : '';
  const urlInfo = classifiedError.targetUrl ? ` (url: ${classifiedError.targetUrl})` : '';
  const statusInfo = classifiedError.httpStatus ? ` (status: ${classifiedError.httpStatus})` : '';

  console.error(
    `${prefix} ${classifiedError.type}: ${classifiedError.message}${proxyInfo}${urlInfo}${statusInfo}`
  );

  if (classifiedError.type === ErrorType.PROXY_ERROR) {
    console.error(`${prefix} This appears to be a proxy issue. Consider removing this proxy from the pool.`);
  } else if (classifiedError.type === ErrorType.TARGET_WEBSITE_ERROR) {
    console.error(`${prefix} This appears to be a target website issue. The request reached the target but was rejected.`);
  } else if (classifiedError.type === ErrorType.RATE_LIMIT_ERROR) {
    console.error(`${prefix} Rate limited. Consider implementing backoff strategy.`);
  }
}





