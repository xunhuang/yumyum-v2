import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import dayjs from "dayjs";
import {
  classifyError,
  logClassifiedError,
  ClassifiedError,
  ErrorType,
} from "./error_types";

const webshareToken = process.env.WEBSHARE_IO_TOKEN;
if (!webshareToken) {
  throw new Error("WEBSHARE_IO_TOKEN is not set");
}

// Maintain a working proxy list at runtime
let workingProxyList: string[] = [];
let isInitialized = false;

async function listProxiesFromWebshare() {
  const url = new URL("https://proxy.webshare.io/api/v2/proxy/list/");
  url.searchParams.append("mode", "direct");
  url.searchParams.append("page", "1");
  url.searchParams.append("page_size", "100");

  const req = await fetch(url.href, {
    method: "GET",
    headers: {
      Authorization: `Token ${webshareToken}`,
    },
  });

  const res = await req.json();
  return res.results.map(
    (p: any) => `${p.proxy_address}:${p.port}:${p.username}:${p.password}`
  ); // Assuming the API returns results in a results field
}

// Initialize proxy list at startup
async function initializeProxyList() {
  try {
    const proxies = await listProxiesFromWebshare();
    if (!proxies || proxies.length === 0) {
      console.error("No proxies returned from Webshare API");
      process.exit(1);
    }
    workingProxyList = proxies;
    isInitialized = true;
    console.log(
      "Successfully initialized proxy list with",
      proxies.length,
      "proxies"
    );
  } catch (error) {
    console.error("Failed to initialize proxy list:", error);
    process.exit(1);
  }
}

// Initialize immediately and export the promise
export const initializationPromise = initializeProxyList();

/**
 * Tests and filters the proxy list to only keep working proxies
 * @param testUrl - URL to test proxies against
 * @param timeoutMs - Timeout in milliseconds for each proxy test (defaults to 5000ms)
 * @returns Array of working proxy strings
 */
export async function rinseProxyList(
  timeoutMs: number = 5000
): Promise<string[]> {
  await waitForInitialization();
  const testUrl: string = `https://api.resy.com/4/find?lat=0&long=0&day=${dayjs()
    .add(7, "days")
    .format("YYYY-MM-DD")}&party_size=2&venue_id=7074`;

  console.log(`Testing ${workingProxyList.length} proxies for reliability...`);

  // Reset to initial list before testing
  const proxyListToTest = [...workingProxyList];
  const workingProxies: string[] = [];

  // Test each proxy in parallel with a concurrency limit
  const concurrencyLimit = 5;
  const chunks = [];

  // Split into chunks for concurrent processing
  for (let i = 0; i < proxyListToTest.length; i += concurrencyLimit) {
    chunks.push(proxyListToTest.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const proxyTests = chunk.map((proxyString) =>
      isProxyEntryWorking(proxyString, testUrl, timeoutMs)
    );

    const results = await Promise.all(proxyTests);
    workingProxies.push(...results.filter((r): r is string => r !== null));
  }

  console.log(
    `Found ${workingProxies.length} working proxies out of ${workingProxyList.length}`
  );

  // Update the working proxy list
  workingProxyList = [...workingProxies];

  return workingProxies;
}

export async function isProxyEntryWorking(
  proxyString: string,
  testUrl: string = `https://api.resy.com/4/find?lat=0&long=0&day=${dayjs()
    .add(7, "days")
    .format("YYYY-MM-DD")}&party_size=2&venue_id=7074`,
  timeoutMs: number = 5000
): Promise<string | null> {
  const [host, port, username, password] = proxyString.split(":");
  const proxyUrl = `http://${username}:${password}@${host}:${port}`;
  const agent = new HttpsProxyAgent(proxyUrl);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(testUrl, {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
      method: "GET",
      agent: agent,
    });

    clearTimeout(timeoutId);

    if (response.status === 200 || response.status === 400) {
      // 400 is okay as it might mean missing params but proxy worked
      console.log(`Proxy working: ${proxyString}`);
      return proxyString;
    } else {
      console.log(
        `Proxy failed with status ${response.status}: ${proxyString}, proxy: ${proxyUrl}`
      );
      return null;
    }
  } catch (error) {
    console.log(`Proxy failed with error: ${proxyString} - ${error}`);
    return null;
  }
}

/**
 * Rinses the proxy list and sets the working proxy list to only include reliable proxies
 * @param forceRefresh - Whether to force a refresh even if working proxies exist
 * @returns The number of working proxies
 */
export async function ensureReliableProxies(
  forceRefresh: boolean = false
): Promise<number> {
  if (forceRefresh || workingProxyList.length === 0) {
    console.log("Refreshing proxy list...");
    const rinseResult = await rinseProxyList();
    if (rinseResult.length > 0) {
      workingProxyList = rinseResult;
      return workingProxyList.length;
    } else {
      console.log("No working proxies found, using initial list");
      workingProxyList = await listProxiesFromWebshare();
      return workingProxyList.length;
    }
  }
  return workingProxyList.length;
}

export async function waitForInitialization() {
  if (!isInitialized) {
    await initializationPromise;
  }
}

export function getWorkingProxyList() {
  return workingProxyList;
}

// Modify getRandomProxy to wait for initialization if needed
export async function getRandomProxy(): Promise<string> {
  await waitForInitialization();
  if (workingProxyList.length === 0) {
    throw new Error("No proxies available");
  }
  const randomIndex = Math.floor(Math.random() * workingProxyList.length);
  return workingProxyList[randomIndex];
}

/**
 * Removes a proxy from the working list
 * @param proxyString - The proxy string to remove
 */
export function removeFailedProxy(proxyString: string): void {
  const index = workingProxyList.indexOf(proxyString);
  if (index !== -1) {
    workingProxyList.splice(index, 1);
    console.log(
      `Removed failed proxy: ${proxyString} (${workingProxyList.length} proxies left)`
    );
  }
}

/**
 * Creates an HttpsProxyAgent for a proxy
 * @param proxyString - The proxy string in host:port:username:password format
 * @returns An HttpsProxyAgent object
 */
export function createProxyAgent(proxyString: string): HttpsProxyAgent<string> {
  const [host, port, username, password] = proxyString.split(":");
  const proxyUrl = `http://${username}:${password}@${host}:${port}`;
  return new HttpsProxyAgent(proxyUrl);
}

/**
 * Fetches data from a URL using a proxy
 * @param url - The URL to fetch
 * @param options - Additional fetch options
 * @returns The response data
 */
async function proxyRequest(
  url: string,
  init: {
    method: string;
    headers?: any;
    timeout?: number;
    body?: any;
    rawBody?: boolean;
  },
  opName: string
): Promise<any> {
  const randomProxy = await getRandomProxy();
  const agent = createProxyAgent(randomProxy);

  const timeout = init.timeout || 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const headersIn = init.headers || {};
  const hasContentType = Object.keys(headersIn).some(
    (h) => h.toLowerCase() === "content-type"
  );

  const defaultHeaders = {
    accept: "application/json, text/plain, */*",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  } as Record<string, string>;

  const finalHeaders = {
    ...defaultHeaders,
    ...(!hasContentType && init.body != null && !init.rawBody
      ? { "content-type": "application/json" }
      : {}),
    ...headersIn,
  } as Record<string, string>;

  const payload =
    init.body != null
      ? init.rawBody
        ? init.body
        : JSON.stringify(init.body)
      : undefined;

  try {
    const response = await fetch(url, {
      headers: finalHeaders,
      method: init.method,
      body: payload as any,
      agent: agent,
      signal: controller.signal as any,
    });

    clearTimeout(timeoutId);

    if (response.status !== 200) {
      // Classify the error based on HTTP status
      const classifiedError = classifyError(
        new Error(`HTTP ${response.status}`),
        randomProxy,
        url,
        response.status
      );

      // logClassifiedError(classifiedError, opName);

      // Only remove proxy if it's a proxy error, not a target website error
      if (classifiedError.type === ErrorType.PROXY_ERROR) {
        console.log(`${opName}: Removing failed proxy ${randomProxy}`);
        removeFailedProxy(randomProxy);
      } else if (classifiedError.type === ErrorType.TARGET_WEBSITE_ERROR) {
        console.log(
          `${opName}: Target website error, keeping proxy ${randomProxy}`
        );
      }

      return null;
    }

    try {
      const json = await response.json();
      return json;
    } catch (error) {
      // JSON parse error - likely a proxy issue if we got HTML instead of JSON
      const classifiedError = classifyError(
        error,
        randomProxy,
        url,
        response.status
      );

      logClassifiedError(classifiedError, opName + " JSON parse");

      if (classifiedError.type === ErrorType.PROXY_ERROR) {
        console.log(
          `${opName}: Removing proxy due to JSON parse error ${randomProxy}`
        );
        removeFailedProxy(randomProxy);
      }

      return null;
    }
  } catch (error) {
    // Classify the error
    const classifiedError = classifyError(error, randomProxy, url);

    logClassifiedError(classifiedError, opName + " fetch");

    // Only remove proxy if it's a proxy error
    if (classifiedError.type === ErrorType.PROXY_ERROR) {
      console.log(`${opName}: Removing failed proxy ${randomProxy}`);
      removeFailedProxy(randomProxy);
    }

    if (workingProxyList.length === 0) {
      console.log(
        "All proxies failed, rinsing proxy list to find working ones"
      );
      const rinseResult = await rinseProxyList();
      if (rinseResult.length === 0) {
        console.log(
          "No working proxies found after rinsing, resetting to initial list"
        );
        workingProxyList = await listProxiesFromWebshare();
      }
    }

    return null;
  }
}

export async function proxyFetch(
  url: string,
  options: { headers?: any; timeout?: number } = {}
): Promise<any> {
  return proxyRequest(
    url,
    { method: "GET", headers: options.headers, timeout: options.timeout },
    "proxyFetch"
  );
}

/**
 * Performs a POST request through a random working proxy.
 * - Sends JSON by default; pass `rawBody: true` to send a pre-serialized string/Buffer.
 * @param url - Endpoint to POST to
 * @param body - Request body (object for JSON, or string/Buffer when `rawBody`)
 * @param options - headers/timeout and `rawBody` flag
 * @returns Parsed JSON on 200, otherwise null. Removes failed proxies from pool.
 */
export async function proxyFetchPost(
  url: string,
  body: any,
  options: { headers?: any; timeout?: number; rawBody?: boolean } = {}
): Promise<any> {
  return proxyRequest(
    url,
    {
      method: "POST",
      headers: options.headers,
      timeout: options.timeout,
      body,
      rawBody: options.rawBody,
    },
    "proxyFetchPost"
  );
}

/**
 * Enhanced proxy request with detailed error reporting
 * Use this when you need to understand what type of error occurred
 */
export async function proxyRequestWithErrorDetails(
  url: string,
  init: {
    method: string;
    headers?: any;
    timeout?: number;
    body?: any;
    rawBody?: boolean;
  },
  opName: string
): Promise<{ data: any; error: ClassifiedError | null }> {
  const randomProxy = await getRandomProxy();
  const agent = createProxyAgent(randomProxy);

  const timeout = init.timeout || 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const headersIn = init.headers || {};
  const hasContentType = Object.keys(headersIn).some(
    (h) => h.toLowerCase() === "content-type"
  );

  const defaultHeaders = {
    accept: "application/json, text/plain, */*",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  } as Record<string, string>;

  const finalHeaders = {
    ...defaultHeaders,
    ...(!hasContentType && init.body != null && !init.rawBody
      ? { "content-type": "application/json" }
      : {}),
    ...headersIn,
  } as Record<string, string>;

  const payload =
    init.body != null
      ? init.rawBody
        ? init.body
        : JSON.stringify(init.body)
      : undefined;

  try {
    const response = await fetch(url, {
      headers: finalHeaders,
      method: init.method,
      body: payload as any,
      agent: agent,
      signal: controller.signal as any,
    });

    clearTimeout(timeoutId);

    if (response.status !== 200) {
      const classifiedError = classifyError(
        new Error(`HTTP ${response.status}`),
        randomProxy,
        url,
        response.status
      );

      logClassifiedError(classifiedError, opName);

      if (classifiedError.type === ErrorType.PROXY_ERROR) {
        removeFailedProxy(randomProxy);
      }

      return { data: null, error: classifiedError };
    }

    try {
      const json = await response.json();
      return { data: json, error: null };
    } catch (error) {
      const classifiedError = classifyError(
        error,
        randomProxy,
        url,
        response.status
      );

      logClassifiedError(classifiedError, opName + " JSON parse");

      if (classifiedError.type === ErrorType.PROXY_ERROR) {
        removeFailedProxy(randomProxy);
      }

      return { data: null, error: classifiedError };
    }
  } catch (error) {
    const classifiedError = classifyError(error, randomProxy, url);

    logClassifiedError(classifiedError, opName + " fetch");

    if (classifiedError.type === ErrorType.PROXY_ERROR) {
      removeFailedProxy(randomProxy);
    }

    if (workingProxyList.length === 0) {
      console.log(
        "All proxies failed, rinsing proxy list to find working ones"
      );
      const rinseResult = await rinseProxyList();
      if (rinseResult.length === 0) {
        console.log(
          "No working proxies found after rinsing, resetting to initial list"
        );
        workingProxyList = await listProxiesFromWebshare();
      }
    }

    return { data: null, error: classifiedError };
  }
}
