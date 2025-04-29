import { useNavigate } from "react-router-dom";

import { Course } from "@/courses/columns.tsx"

import { useSearchParams } from "react-router-dom";
import {useEffect} from "react";

export default function courseRedirect() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [searchParams] = useSearchParams();
    const selectedCourse: Course = {
        id: parseInt(searchParams.get("courseID") as string) || 0,  // Fallback to empty string if missing
        name: searchParams.get("courseName") || "",
        enrollment_term_id: parseInt(searchParams.get("enrollmentTermID") as string),
    }

    if (selectedCourse.id == 0 || selectedCourse.name === "") {
        return <h1>No course selected, please return to the last page.</h1>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        navigate("/swipe", {state: {selectedCourse: selectedCourse}});
    }, [navigate]);

    return null;
}
