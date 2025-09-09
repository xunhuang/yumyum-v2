export class WeekWindowBuckets {
    private readonly stepSec: number; // e.g., 900 (15m)
    private readonly buckets: { start: number; e: number; t: number; }[];
    private readonly horizonSec: number; // 7*24*3600

    constructor(stepSec = 900, horizonSec = 7 * 24 * 3600) {
        this.stepSec = stepSec;
        const n = Math.ceil(horizonSec / stepSec);
        this.buckets = Array.from({ length: n }, () => ({ start: 0, e: 0, t: 0 }));
        this.horizonSec = horizonSec;
    }

    add(ok: boolean) {
        const now = Math.floor(Date.now() / 1000);
        const start = now - (now % this.stepSec);
        const i = (start / this.stepSec) % this.buckets.length;
        const b = this.buckets[i];
        if (b.start !== start) { b.start = start; b.e = 0; b.t = 0; }
        if (!ok) b.e++;
        b.t++;
    }

    errorRate() {
        const now = Math.floor(Date.now() / 1000);
        const cutoff = now - this.horizonSec;
        let e = 0, t = 0;
        for (const b of this.buckets) {
            if (b.start > cutoff) { e += b.e; t += b.t; }
        }
        return { errors: e, total: t, rate: t ? e / t : 0 };
    }
}
export const VendorAPIErrorBuckets = new Map<string, WeekWindowBuckets>();
