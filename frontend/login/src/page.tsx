import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
// import { getSelf } from "@/TS Scripts/getSelf.ts"

import '@/Page.css'
import '@/index.css'

import appIcon from "@/assets/ScanMo.png";
import courseIcon from "@/assets/CourseIcon.ico";
import { refreshData } from '@/TS Scripts/refreshData.ts'
import {useState} from "react";

export default function Page() {
    const navigate = useNavigate()
    const [resyncStatus, setResyncStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

    async function handleResync() {
        setResyncStatus("loading");
        try {
            await refreshData();
            setResyncStatus("done");
            setTimeout(() => setResyncStatus("idle"), 3000); // Reset message after 3 seconds
        } catch (e) {
            console.error(e);
            setResyncStatus("error");
        }
    }

    return (
        <div className="body">
            <main className="logoSplash">
                <img src={appIcon} style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "35%"
                }} alt="ScanMo Logo"/>
                <p className="text-lg text-gray-500">Connected to New York Tech Canvas</p>
                <Button className="big-button" onClick={() => navigate("/course-selection")}>
                    <img src={courseIcon} style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "11em",
                        margin: "3.5em",
                    }} alt="Course Icon"/>
                    <div className="divider"></div>
                    <div className="subtitle">View Courses</div>
                </Button>
            </main>
            <div className={"fixed-bottom"}>
                <p className={"ps"}>
                    <i>
                        <ins style={{ cursor: 'pointer' }} onClick={handleResync}>
                            Click here to re-sync database with Canvas
                        </ins>
                        {resyncStatus === "loading" && <span> — Syncing...</span>}
                        {resyncStatus === "done" && <span style={{ color: "green" }}> — Done!</span>}
                        {resyncStatus === "error" && <span style={{ color: "red" }}> — Failed</span>}
                    </i>
                </p>
            </div>
        </div>
    )
}
