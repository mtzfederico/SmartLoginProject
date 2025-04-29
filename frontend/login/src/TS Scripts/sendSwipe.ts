// sendSwipe.ts

export interface CheckCardResponse {
    success: boolean;
    registered: boolean;
    userID?: number;
    error?: string;
}

import { getBackendURL} from "@/TS Scripts/apiURL.ts";

export async function sendSwipe(cardID: string): Promise<CheckCardResponse> {

    const res = await fetch(getBackendURL() + '/checkCard', {
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
