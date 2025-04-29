// sendSwipe.ts

export interface CheckCardResponse {
    success: boolean;
    registered: boolean;
    userID?: number;
    error?: string;
}

export async function sendSwipe(cardID: string): Promise<CheckCardResponse> {
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const res = await fetch(backend_url + '/checkCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardID }),
    });

    const response: CheckCardResponse = await res.json();
    console.log(response);

    if (!res.ok) {
        throw new Error(`Failed to check card. ${response.error || `unknown error. ${res.status}`}`);
    }

    return response;
}
