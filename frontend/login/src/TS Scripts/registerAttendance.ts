export interface registerAttendanceRequest {
    cardID: string
    courseID: number
}

export async function registerAttendance(request: registerAttendanceRequest): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch("http://localhost:9091/setAttendance", {
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
        console.error("[markAttendance] Error:", err)
        return { success: false, error: "Network or server error" }
    }
}
