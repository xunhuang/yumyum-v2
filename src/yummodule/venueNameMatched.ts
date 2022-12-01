import { uspsLookupStreet } from './uspsLookupStreet';

export function venueNameMatched(a: string, b: string): boolean {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a === b;
}
export async function addressMatch(street_a: string, street_b: string, city: string, state: string): Promise<boolean> {
    street_a = street_a.toLowerCase();
    street_b = street_b.toLowerCase();
    if (street_a === street_b) {
        return true;
    }

    const usps_street_a = await uspsLookupStreet(street_a, city, state);
    const usps_street_b = await uspsLookupStreet(street_b, city, state);
    return usps_street_a === usps_street_b;
}
