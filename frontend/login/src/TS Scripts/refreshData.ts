// refreshData.ts
import { getBackendURL} from "@/TS Scripts/apiURL.ts";

export async function refreshData(): Promise<void> {

    const res = await fetch(getBackendURL() + '/refreshData', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(`Failed to refresh data: ${message}`);
    }
}
