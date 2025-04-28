// getData.ts
import {GetCoursesResponse} from "@/courses/columns.tsx";

export async function getCourses() {
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const res = await fetch(backend_url + '/getCourses', {
        method: 'GET',
    });

    const response: GetCoursesResponse = await res.json();
    console.log(response);

    if (!res.ok) {
        throw new Error(`Failed to fetch courses. ${response.error || `unknown error. ${res.status}`}`);
    }

    return response.courses

    /*
    return courses.map((course) => ({
        id: course.id,
        name: course.name,
        enrollment_term_id: course.enrollment_term_id,
    }));*/
}



