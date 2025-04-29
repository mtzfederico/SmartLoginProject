// getStudents.ts
import {GetCoursesResponse} from "@/courses/columns.tsx";

const termMap: Record<number, number> = {
    1: 0,
    176: 1,
    149: 2,
    175: 3,
    142: 4,
    177: 5,
    157: 6,
}

import { getBackendURL} from "@/TS Scripts/apiURL.ts";

export async function getCourses() {

    const res = await fetch(getBackendURL() + '/getCourses', {
        method: 'GET',
    });

    const response: GetCoursesResponse = await res.json();
    console.log(response);

    if (!res.ok) {
        throw new Error(`Failed to fetch courses. ${response.error || `unknown error. ${res.status}`}`);
    }

    // return response.courses

    return response.courses.map((course) => ({
        id: course.id,
        name: course.name,
        enrollment_term_id: termMap[course.enrollment_term_id],
    }));
}



