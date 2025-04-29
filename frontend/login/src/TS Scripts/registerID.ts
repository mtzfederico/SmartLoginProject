export interface RegisterIDCardRequest {
    studentID: number
    courseID: number
    cardID: string
}

export async function registerIDCard(request: RegisterIDCardRequest): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch("http://localhost:9091/registerIDCard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "Unknown error" }
        }

        return { success: true }
    } catch (err) {
        console.error("[registerIDCard] Error:", err)
        return { success: false, error: "Network or server error" }
    }
}
