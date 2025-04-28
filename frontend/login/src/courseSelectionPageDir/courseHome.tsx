import { useLocation } from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export default function CourseHome() {
    // Get the state passed from the previous page
    const location = useLocation();
    const { selectedCourse } = location.state || {};  // Fallback in case no data is passed

    if (!selectedCourse) {
        return <h1>No course selected, ️please return to the last page.</h1>;
    }

    return (
        <div>
            <div className={"vertical-container"}>
                <h1 style={{ marginBottom: "40px"}}>{selectedCourse.name}</h1>
                <div className={"button-row"}>
                    <Button className="big-button">
                        <div className="icon">🔔</div>
                        <div className="divider"></div>
                        <div className="subtitle">View Records</div>
                    </Button>
                    <Button className="big-button">
                        <div className="icon">⚙</div>
                        <div className="divider"></div>
                        <div className="subtitle">Scan Attendance</div>
                    </Button>
                </div>
            </div>
        </div>
    );
}
