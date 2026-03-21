/**
 * Example script demonstrating how to distinguish between proxy errors and target website errors
 */

import { proxyRequestWithErrorDetails } from "./proxy_manager";
import { ErrorType, ClassifiedError } from "./error_types";

/**
 * Example function showing how to handle different types of errors
 */
export async function analyzeRequestError(url: string, operationName: string): Promise<void> {
  console.log(`\n=== Analyzing request to ${url} ===`);

  const result = await proxyRequestWithErrorDetails(
    url,
    {
      method: "GET",
      headers: {
        "accept": "application/json"
      },
      timeout: 10000
    },
    operationName
  );

  if (result.error) {
    const error = result.error;

    console.log(`\nError Analysis:`);
    console.log(`- Error Type: ${error.type}`);
    console.log(`- Message: ${error.message}`);
    console.log(`- Proxy Used: ${error.proxyUsed || 'None'}`);
    console.log(`- Target URL: ${error.targetUrl || 'None'}`);
    console.log(`- HTTP Status: ${error.httpStatus || 'None'}`);
    console.log(`- Is Retryable: ${error.isRetryable ? 'Yes' : 'No'}`);

    // Provide specific guidance based on error type
    switch (error.type) {
      case ErrorType.PROXY_ERROR:
        console.log(`\n🔧 PROXY ERROR DETECTED:`);
        console.log(`- The issue is with the proxy server, not the target website`);
        console.log(`- The proxy has been automatically removed from the pool`);
        console.log(`- You can retry with a different proxy`);
        console.log(`- Consider checking proxy server status or credentials`);
        break;

      case ErrorType.TARGET_WEBSITE_ERROR:
        console.log(`\n🌐 TARGET WEBSITE ERROR DETECTED:`);
        console.log(`- The request reached the target website successfully`);
        console.log(`- The target website rejected the request (HTTP ${error.httpStatus})`);
        console.log(`- This could be due to invalid parameters, missing authentication, or API changes`);
        console.log(`- The proxy is working fine and was kept in the pool`);
        break;

      case ErrorType.RATE_LIMIT_ERROR:
        console.log(`\n⏰ RATE LIMIT ERROR DETECTED:`);
        console.log(`- You're being rate limited by the target website`);
        console.log(`- Implement exponential backoff before retrying`);
        console.log(`- Consider reducing request frequency`);
        break;

      case ErrorType.AUTHENTICATION_ERROR:
        console.log(`\n🔐 AUTHENTICATION ERROR DETECTED:`);
        console.log(`- Authentication failed (HTTP ${error.httpStatus})`);
        console.log(`- Check your API keys, tokens, or credentials`);
        console.log(`- This is not a proxy issue`);
        break;

      case ErrorType.TIMEOUT_ERROR:
        console.log(`\n⏱️ TIMEOUT ERROR DETECTED:`);
        console.log(`- Request timed out after ${error.httpStatus || 'unknown'}ms`);
        console.log(`- Could be proxy or network issue`);
        console.log(`- Consider increasing timeout or checking network connectivity`);
        break;

      case ErrorType.NETWORK_ERROR:
        console.log(`\n🌐 NETWORK ERROR DETECTED:`);
        console.log(`- Network connectivity issue`);
        console.log(`- Check your internet connection`);
        console.log(`- Could be DNS resolution or routing problem`);
        break;

      default:
        console.log(`\n❓ UNKNOWN ERROR DETECTED:`);
        console.log(`- Error type could not be determined`);
        console.log(`- Check the original error for more details`);
    }
  } else {
    console.log(`\n✅ SUCCESS: Request completed successfully`);
    console.log(`- Data received: ${JSON.stringify(result.data).substring(0, 100)}...`);
  }
}

/**
 * Helper function to test different types of errors
 */
export async function testErrorScenarios(): Promise<void> {
  console.log("Testing different error scenarios...\n");

  // Test with a working endpoint
  await analyzeRequestError("https://api.resy.com/4/find?lat=0&long=0&day=2024-01-01&party_size=2&venue_id=7074", "Resy API Test");

  // Test with a non-existent endpoint (404 error)
  await analyzeRequestError("https://api.resy.com/nonexistent", "404 Test");

  // Test with an invalid URL (network error)
  await analyzeRequestError("https://invalid-domain-that-does-not-exist.com", "Network Error Test");

  // Test with a timeout (very short timeout)
  await analyzeRequestError("https://httpbin.org/delay/5", "Timeout Test");
}

// Example usage
if (require.main === module) {
  testErrorScenarios().catch(console.error);
}






