import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

import QRCode from "react-qr-code";
import { useState } from "react";

import recordIcon from "@/assets/NotepadIcon.ico";
import swipeIcon from "@/assets/SwipeIcon.ico";
import QRIcon from "@/assets/QRIcon.ico";

export default function CourseHome() {
    // Get the state passed from the previous page
    const navigate = useNavigate()
    const location = useLocation();
    const { selectedCourse } = location.state || {};  // Fallback in case no data is passed
    const frontendPort = import.meta.env.VITE_FRONTEND_PORT;

    const [showQR, setShowQR] = useState(false);

    if (!selectedCourse) {
        return <h1>No course selected, please return to the last page.</h1>;
    }

    const redirectURL = (`${window.location.protocol}//${window.location.hostname}:${frontendPort}` + `/redirect?courseID=${selectedCourse.id}&courseName=${encodeURIComponent(selectedCourse.name)}&enrollmentTermID=${selectedCourse.enrollment_term_id}`);

    return (
        <div>
            <div className="fixed-top">
                <h1 className="small-h1"
                    style={{
                    marginTop: "1.2em", marginBottom: "1.2em"
                }}
                >{selectedCourse.name}</h1>
            </div>
            <div style={{ display: "flex", justifyContent: "center", }}>
                <div className={"button-row"} style={{
                    marginTop: "5em",
                    display: "flex",
                    gap: "2em", // space between buttons
                    maxWidth: "90vw", // 90% of viewport width
                }}>
                    <Button className="big-button" onClick={() => navigate("/course-records", { state: { selectedCourse: selectedCourse } })}>
                    <img src={recordIcon} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "11em",
                            margin: "3.5em",
                        }} alt="Record Icon"/>
                        <div className="divider"></div>
                        <div className="subtitle">View Records</div>
                    </Button>
                    <Button className="big-button" onClick={() => navigate("/swipe", { state: { selectedCourse: selectedCourse } })}>
                        <img src={swipeIcon} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "11em",
                            margin: "3.5em",
                        }} alt="Swipe Icon"/>
                        <div className="divider"></div>
                        <div className="subtitle">Scan Attendance</div>
                    </Button>
                    <Button className="big-button" onClick={() => setShowQR(true)}>
                        <img src={QRIcon} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "11em",
                            margin: "3.5em",
                        }} alt="Swipe Icon" />
                        <div className="divider"></div>
                        <div className="subtitle">Generate QR Code</div>
                    </Button>
                </div>
            </div>

            {showQR && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div style={{ background: "#1a1a1a", padding: "2em", borderRadius: "1em", textAlign: "center" }}>
                        <h2>Scan to Open Swipe Page</h2>
                        <QRCode value={redirectURL} />
                        <div style={{ marginTop: "1em" }}>
                            <Button onClick={() => setShowQR(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
