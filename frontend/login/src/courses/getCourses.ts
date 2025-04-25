// getData.ts
import {Course} from "@/courses/columns.tsx";

export async function getCourses() {
    const token = import.meta.env.VITE_CANVAS_TOKEN; // Load your token

    const url = encodeURIComponent('https://nyit.instructure.com/api/v1/courses/?access_token=' + token + '&per_page=100');

    const res = await fetch(`https://api.allorigins.win/raw?url=${url}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch courses");
    }

    const termMap: Record<string, string> = {
        "1": "0",
        "175": "1",
        "142": "2",
        "177": "3",
        "157": "4",
    }

    const courses: Course[] = await res.json();
    console.log(courses);

    return courses.map((course) => ({
        id: course.id,
        name: course.name,
        enrollment_term_id: termMap[course.enrollment_term_id],
    }));
}



