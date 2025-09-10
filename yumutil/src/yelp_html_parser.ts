import cheerio from "cheerio";
import fs from "fs";

export interface ExtractedAddress {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
  formatted?: string; // comma-joined
}

/**
 * Build a formatted, comma-separated address string from components.
 */
function formatAddress(a: ExtractedAddress): string | undefined {
  const parts = [
    a.streetAddress,
    [a.addressLocality, a.addressRegion].filter(Boolean).join(", ") || undefined,
    a.postalCode,
    a.addressCountry,
  ].filter(Boolean) as string[];
  return parts.length ? parts.join(", ") : undefined;
}

/**
 * Attempt to parse city, state, and ZIP from a formatted address string.
 * Handles common US formats like:
 *  - "123 Main St, San Francisco, CA 94103, United States"
 *  - "123 Main St, San Francisco, CA, 94103"
 */
function parseUSCityStateZip(formatted?: string): {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
} {
  if (!formatted) return {};
  const cleaned = formatted.replace(/\s+/g, " ").trim();
  // Remove trailing country if present
  const noCountry = cleaned.replace(/,\s*(United States|USA|US)\.?$/i, "");
  // Full pattern: "Street, City, ST 12345" (ZIP optional)
  const m = noCountry.match(/^(.+?),\s*([^,]+),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/);
  if (m) {
    return { street: m[1].trim(), city: m[2].trim(), state: m[3], zip: (m[4] || "").trim() || undefined };
  }
  // Variant: "Street, City, ST, 12345"
  const m2 = noCountry.match(/^(.+?),\s*([^,]+),\s*([A-Z]{2}),\s*(\d{5}(?:-\d{4})?)$/);
  if (m2) {
    return { street: m2[1].trim(), city: m2[2].trim(), state: m2[3], zip: m2[4] };
  }
  // Heuristic: split by commas and infer tokens from the end
  const tokens = noCountry.split(",").map((t) => t.trim()).filter(Boolean);
  if (tokens.length >= 2) {
    // Case A: last token looks like ZIP or ZIP+4
    const last = tokens[tokens.length - 1];
    const zipMatch = last.match(/^(\d{5})(?:-\d{4})?$/);
    if (zipMatch && tokens.length >= 3) {
      const prev = tokens[tokens.length - 2];
      const stMatch = prev.match(/^([A-Z]{2})(?:\s+.*)?$/);
      if (stMatch) {
        const cityTok = tokens[tokens.length - 3];
        const streetTok = tokens.slice(0, tokens.length - 3).join(", ");
        return {
          street: streetTok || undefined,
          city: cityTok || undefined,
          state: stMatch[1],
          zip: zipMatch[0],
        };
      }
    }
    // Case B: last token contains state and maybe zip (e.g., "CA 94107" or just "CA")
    const lastSt = last.match(/^([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/);
    if (lastSt && tokens.length >= 2) {
      const cityTok = tokens[tokens.length - 2];
      const streetTok = tokens.slice(0, tokens.length - 2).join(", ");
      return {
        street: streetTok || undefined,
        city: cityTok || undefined,
        state: lastSt[1],
        zip: (lastSt[2] || undefined) as string | undefined,
      };
    }
  }
  return {};
}

/**
 * Enrich missing components (city/state/zip) from the formatted string if possible.
 */
function enrichFromFormatted(a: ExtractedAddress): ExtractedAddress {
  const parts = parseUSCityStateZip(a.formatted);
  if (!a.streetAddress && parts.street) a.streetAddress = parts.street;
  if (!a.addressLocality && parts.city) a.addressLocality = parts.city;
  if (!a.addressRegion && parts.state) a.addressRegion = parts.state;
  if (!a.postalCode && parts.zip) a.postalCode = parts.zip;
  return a;
}

/**
 * Try to normalize a raw object to ExtractedAddress if it looks like a schema.org PostalAddress
 */
function normalizePostalAddress(obj: any): ExtractedAddress | null {
  if (!obj || typeof obj !== "object") return null;
  let a: ExtractedAddress = {
    streetAddress: obj.streetAddress || obj["street-address"] || obj.street || obj.address1,
    addressLocality: obj.addressLocality || obj.locality || obj.city,
    addressRegion: obj.addressRegion || obj.region || obj.state,
    postalCode: obj.postalCode || obj["postal-code"] || obj.zip || obj.zipCode,
    addressCountry: obj.addressCountry || obj.country || obj["country-name"],
  };
  const formatted = formatAddress(a);
  if (formatted) a.formatted = formatted;
  a = enrichFromFormatted(a);
  if (a.formatted || a.addressLocality || a.addressRegion || a.postalCode || a.streetAddress) return a;
  return null;
}

/**
 * Extract from JSON-LD scripts (application/ld+json). Yelp typically embeds a LocalBusiness/Restaurant
 * with an address PostalAddress object.
 */
function extractFromJsonLd($: cheerio.Root): ExtractedAddress | null {
  const scripts = $('script[type="application/ld+json"]').toArray();
  for (const s of scripts) {
    const text = $(s).contents().text();
    if (!text) continue;
    try {
      const json = JSON.parse(text);
      const candidates: any[] = Array.isArray(json) ? json : [json];
      for (const entry of candidates) {
        // Sometimes nested in @graph
        const graph = entry && entry["@graph"]; 
        const list: any[] = graph && Array.isArray(graph) ? graph : [entry];
        for (const item of list) {
          const addr = item && (item.address || (item["item"] && item["item"].address));
          const normalized = normalizePostalAddress(addr);
          if (normalized) return normalized;
          // Occasionally address is nested deeper
          if (item && typeof item === "object") {
            for (const k of Object.keys(item)) {
              const v = (item as any)[k];
              if (v && typeof v === "object" && v["@type"] === "PostalAddress") {
                const n = normalizePostalAddress(v);
                if (n) return n;
              }
            }
          }
        }
      }
    } catch (_) {
      // ignore JSON parse errors; keep trying others
    }
  }
  return null;
}

/**
 * Extract from microdata: itemscope itemtype=PostalAddress, or itemprop=address with nested props
 */
function extractFromMicrodata($: cheerio.Root): ExtractedAddress | null {
  // itemprop="address" that contains nested properties
  const containers = $('[itemprop="address"]').toArray();
  for (const c of containers) {
    const ctx = $(c);
    let a: ExtractedAddress = {
      streetAddress: ctx.find('[itemprop="streetAddress"]').first().text().trim() || undefined,
      addressLocality: ctx.find('[itemprop="addressLocality"]').first().text().trim() || undefined,
      addressRegion: ctx.find('[itemprop="addressRegion"]').first().text().trim() || undefined,
      postalCode: ctx.find('[itemprop="postalCode"]').first().text().trim() || undefined,
      addressCountry: ctx.find('[itemprop="addressCountry"]').first().text().trim() || undefined,
    };
    const formatted = formatAddress(a);
    if (formatted) a.formatted = formatted;
    a = enrichFromFormatted(a);
    if (a.formatted) return a;
  }

  // itemscope for PostalAddress
  const scopes = $('[itemscope][itemtype*="PostalAddress"]').toArray();
  for (const s of scopes) {
    const ctx = $(s);
    let a: ExtractedAddress = {
      streetAddress: ctx.find('[itemprop="streetAddress"]').first().text().trim() || undefined,
      addressLocality: ctx.find('[itemprop="addressLocality"]').first().text().trim() || undefined,
      addressRegion: ctx.find('[itemprop="addressRegion"]').first().text().trim() || undefined,
      postalCode: ctx.find('[itemprop="postalCode"]').first().text().trim() || undefined,
      addressCountry: ctx.find('[itemprop="addressCountry"]').first().text().trim() || undefined,
    };
    const formatted = formatAddress(a);
    if (formatted) a.formatted = formatted;
    a = enrichFromFormatted(a);
    if (a.formatted) return a;
  }
  return null;
}

/**
 * Extract from OpenGraph / business contact meta tags
 */
function extractFromMeta($: cheerio.Root): ExtractedAddress | null {
  const get = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content");

  let a: ExtractedAddress = {
    streetAddress:
      get("og:street-address") ||
      get("business:contact_data:street_address") ||
      undefined,
    addressLocality:
      get("og:locality") || get("business:contact_data:locality") || undefined,
    addressRegion:
      get("og:region") || get("business:contact_data:region") || undefined,
    postalCode:
      get("og:postal-code") || get("business:contact_data:postal_code") || undefined,
    addressCountry:
      get("og:country-name") || get("business:contact_data:country_name") || undefined,
  };
  const formatted = formatAddress(a);
  if (formatted) a.formatted = formatted;
  a = enrichFromFormatted(a);
  if (a.formatted) return a;
  return null;
}

/**
 * Final fallback: attempt to glean a plausible address from visible <address> tags or
 * map links. This is inherently brittle; kept as a last resort.
 */
function extractFromVisibleAddress($: cheerio.Root): ExtractedAddress | null {
  // <address> element text
  const addrText = $("address").first().text().replace(/\s+/g, " ").trim();
  if (addrText) {
    const a: ExtractedAddress = { formatted: addrText };
    return enrichFromFormatted(a);
  }

  // Map links sometimes include line-separated address in aria-label or data attributes
  const mapLink = $('a[href*="maps.google"]').first();
  const aria = mapLink.attr("aria-label") || mapLink.attr("title");
  if (aria) {
    const t = aria.replace(/\s+/g, " ").trim();
    if (t) return { formatted: t };
  }

  return null;
}

/**
 * Extract a venue's physical address from a Yelp HTML string.
 * Tries JSON-LD, microdata, OpenGraph, then visible fallbacks.
 */
export function extractYelpAddressFromHtml(html: string): ExtractedAddress | null {
  const $ = cheerio.load(html);
  // Extract address first
  const addr =
    extractFromJsonLd($) ||
    extractFromMicrodata($) ||
    extractFromMeta($) ||
    extractFromVisibleAddress($);

  // Extract geo (lat/long) from multiple sources and merge into result
  const geo =
    extractGeoFromJsonLd($) ||
    extractGeoFromMeta($) ||
    extractGeoFromLinks($) ||
    extractGeoFromScripts($);

  if (!addr && !geo) return null;
  if (!addr) return geo as ExtractedAddress;
  if (geo?.latitude != null) addr.latitude = geo.latitude;
  if (geo?.longitude != null) addr.longitude = geo.longitude;
  return addr;
}

/**
 * Convenience: read a local HTML file and extract address.
 */
export function extractYelpAddressFromFile(filePath: string): ExtractedAddress | null {
  const html = fs.readFileSync(filePath, "utf8");
  return extractYelpAddressFromHtml(html);
}

/**
 * Convenience: extract a fully formatted US address string (street, city, state ZIP)
 * from a local Yelp HTML file. Falls back to any best-effort formatted string.
 */
export function extractYelpFullAddressFromFile(filePath: string): ExtractedAddress | null {
  const a = extractYelpAddressFromFile(filePath);
  if (!a) return null;
  // Ensure enrichment based on any formatted text present
  const enriched = enrichFromFormatted({ ...a });
  const { streetAddress, addressLocality, addressRegion, postalCode } = enriched;
  if (streetAddress && addressLocality && addressRegion && postalCode) {
    enriched.formatted = `${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}`;
  } else if (!enriched.formatted) {
    enriched.formatted = formatAddress(enriched);
  }
  return enriched;
}

// ---------- Geo extraction helpers ----------

function toNum(v: any): number | undefined {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return isNaN(n) ? undefined : n;
}

function extractGeoFromJsonLd($: cheerio.Root): ExtractedAddress | null {
  const scripts = $('script[type="application/ld+json"]').toArray();
  for (const s of scripts) {
    const text = $(s).contents().text();
    if (!text) continue;
    try {
      const json = JSON.parse(text);
      const list: any[] = Array.isArray(json) ? json : [json];
      const flatten = (obj: any): any[] => {
        if (!obj || typeof obj !== "object") return [];
        const arr: any[] = [obj];
        if (Array.isArray(obj["@graph"])) arr.push(...obj["@graph"]);
        return arr;
      };
      for (const entry of list.flatMap(flatten)) {
        const geo = entry?.geo || entry?.location?.geo;
        if (geo) {
          const lat = toNum(geo.latitude || geo["@latitude"] || geo.lat || geo["geoLatitude"]);
          const lon = toNum(geo.longitude || geo["@longitude"] || geo.lng || geo["geoLongitude"]);
          if (lat != null && lon != null) {
            return { latitude: lat, longitude: lon };
          }
        }
      }
    } catch (_) {
      // ignore
    }
  }
  return null;
}

function extractGeoFromMeta($: cheerio.Root): ExtractedAddress | null {
  const get = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content");
  const lat = toNum(
    get("og:latitude") ||
      get("place:location:latitude") ||
      get("icbm:latitude") ||
      get("geo.position.latitude")
  );
  const lon = toNum(
    get("og:longitude") ||
      get("place:location:longitude") ||
      get("icbm:longitude") ||
      get("geo.position.longitude")
  );
  if (lat != null && lon != null) return { latitude: lat, longitude: lon };
  // Sometimes packed into single meta: geo.position="lat;long"
  const geoPos = get("geo.position");
  if (geoPos) {
    const m = geoPos.match(/^\s*([-+]?\d+\.\d+)\s*;\s*([-+]?\d+\.\d+)\s*$/);
    if (m) {
      const la = toNum(m[1]);
      const lo = toNum(m[2]);
      if (la != null && lo != null) return { latitude: la, longitude: lo };
    }
  }
  return null;
}

function extractGeoFromLinks($: cheerio.Root): ExtractedAddress | null {
  // Look for Google Maps links containing ll=lat,long or query with lat,long
  const anchors = $('a[href*="maps.google"]').toArray();
  for (const a of anchors) {
    const href = $(a).attr("href") || "";
    try {
      const u = new URL(href, "https://www.yelp.com");
      const ll = u.searchParams.get("ll") || u.searchParams.get("center");
      if (ll) {
        const [la, lo] = ll.split(",").map((s) => parseFloat(s));
        if (!isNaN(la) && !isNaN(lo)) return { latitude: la, longitude: lo };
      }
      const q = u.searchParams.get("q");
      if (q) {
        const m = q.match(/([-+]?\d+\.\d+)\s*,\s*([-+]?\d+\.\d+)/);
        if (m) {
          const la = parseFloat(m[1]);
          const lo = parseFloat(m[2]);
          if (!isNaN(la) && !isNaN(lo)) return { latitude: la, longitude: lo };
        }
      }
    } catch (_) {
      // ignore invalid URL
    }
  }
  return null;
}

function extractGeoFromScripts($: cheerio.Root): ExtractedAddress | null {
  // Yelp pages often include embedded JSON with coordinates in data attributes or inline scripts.
  // Search for common patterns like "latitude": <num>, "longitude": <num>
  const texts: string[] = [];
  $('script').each((_, el) => {
    const t = $(el).text();
    if (t) texts.push(t);
  });
  const blob = texts.join("\n");
  // Try to find the first lat/long pair
  const regex = /"latitude"\s*:\s*([-+]?\d+\.\d+).*?"longitude"\s*:\s*([-+]?\d+\.\d+)/s;
  const m = blob.match(regex);
  if (m) {
    const la = parseFloat(m[1]);
    const lo = parseFloat(m[2]);
    if (!isNaN(la) && !isNaN(lo)) return { latitude: la, longitude: lo };
  }
  return null;
}
