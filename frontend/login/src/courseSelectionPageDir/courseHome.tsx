import { useLocation } from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

import recordIcon from "@/assets/NotepadIcon.ico";
import swipeIcon from "@/assets/SwipeIcon.ico";

export default function CourseHome() {
    // Get the state passed from the previous page
    const location = useLocation();
    const { selectedCourse } = location.state || {};  // Fallback in case no data is passed

    if (!selectedCourse) {
        return <h1>No course selected, please return to the last page.</h1>;
    }

    return (
        <div>
            <div className="fixed-top">
                <h1 className="small-h1"
                    style={{
                    marginTop: "1.2em", marginBottom: "1.2em"
                }}
                >{selectedCourse.name}</h1>
            </div>
            <div className={"vertical-container"}>
                <div className={"button-row"} style={{
                    marginTop: "5em",
                }}>
                    <Button className="big-button">
                        <img src={recordIcon} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "11em",
                            margin: "3.5em",
                        }} alt="Record Icon"/>
                        <div className="divider"></div>
                        <div className="subtitle">View Records</div>
                    </Button>
                    <Button className="big-button">
                        <img src={swipeIcon} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "11em",
                            margin: "3.5em",
                        }} alt="Swipe Icon"/>
                        <div className="divider"></div>
                        <div className="subtitle">Scan Attendance</div>
                    </Button>
                </div>
            </div>
        </div>
    );
}
