// refreshData.ts
export async function refreshData(): Promise<void> {
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const res = await fetch(`${backend_url}/refreshData`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(`Failed to refresh data: ${message}`);
    }
}
