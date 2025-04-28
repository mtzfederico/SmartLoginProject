import { useLocation } from "react-router-dom";

export default function CourseHome() {
    // Get the state passed from the previous page
    const location = useLocation();
    const { selectedCourse } = location.state || {};  // Fallback in case no data is passed

    if (!selectedCourse) {
        return <h1>No course selected, please return to the last page.</h1>;
    }

    return (
        <div>
            <h1>{selectedCourse.name}</h1>
            <p>ID: {selectedCourse.id}</p>
            <p>Term ID: {selectedCourse.enrollment_term_id}</p>
        </div>
    );
}
