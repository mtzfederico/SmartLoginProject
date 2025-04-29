export interface GetAttendanceRequest {
    courseID: number
    startDate: string
    endDate: string
}

export interface AttendanceData {
    id: number
    name: string
    avatar_url: string
    date: string
}

import { getBackendURL} from "@/TS Scripts/apiURL.ts";

export async function getAttendance(request: GetAttendanceRequest): Promise<{ success: boolean; students?: AttendanceData[]; error?: string }> {
    try {

        const response = await fetch(getBackendURL() + '/getAttendance', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })

        const data = await response.json()
        console.log(data)

        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "Unknown error" }
        }

        return { success: true, students: data.students }
    } catch (err) {
        console.error("[getAttendance] Error:", err)
        return { success: false, error: "Network or server error" }
    }
}
