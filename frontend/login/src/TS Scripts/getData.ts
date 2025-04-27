// getData.ts
import {Student} from "@/students/columns.tsx";

export async function getData(courseId: number) {
    const token = import.meta.env.VITE_CANVAS_TOKEN; // Load your token

    const url = encodeURIComponent('https://nyit.instructure.com/api/v1/courses/' + courseId + '/users?access_token=' + token + '&enrollment_type[]=student&per_page=100&include[]=avatar_url');

    const res = await fetch(`https://api.allorigins.win/raw?url=${url}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch students");
    }

    const users: Student[] = await res.json();
    console.log(users);

    return users.map((user) => ({
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
    }));
}



