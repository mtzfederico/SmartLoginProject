// getStudentsWithNoID.tsx
import {GetStudentsResponse} from "@/students/columns.tsx";

import { getBackendURL} from "@/TS Scripts/apiURL.ts";

export async function getStudents(courseID: number) {

    const res = await fetch(getBackendURL() + '/getStudentsWithNoID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "courseID": courseID }),
    });

    const response: GetStudentsResponse = await res.json();

    if (!res.ok) {
        throw new Error(`Failed to fetch students. ${response.error || `unknown error. ${res.status}`}`);
    }

    return response.students.map((user) => ({
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
    }));
}