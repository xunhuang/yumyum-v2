export function normalizeUrl(url: string) {
    if (!url.includes("http")) {
        return "https://" + url;
    }
    return url;
}