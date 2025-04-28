import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { getSelf } from "@/TS Scripts/getSelf.ts"

import '@/Page.css'
import '@/index.css'
import {useEffect, useState} from "react";

import appIcon from "@/assets/ScanMo.png";
import courseIcon from "@/assets/CourseIcon.ico";

export default function Page() {
    const navigate = useNavigate()
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        async function fetchUser() {
            try {
                const name = await getSelf(); // getSelf returns 'name' from Canvas account object
                setUserName(name);
            } catch (error) {
                console.error(error);
                setUserName("Unknown User");
            }
        }
        fetchUser();
    }, []);

    return (
        <div className="body">
            <main className="logoSplash">
                <img src={appIcon} style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "35%"
                }} alt="ScanMo Logo"/>
                <p className="text-lg text-gray-500">Connected to Canvas as <b> {userName ? userName : "Loading..."} </b></p>
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
                <p className={"ps"}> <i> <ins> Not you? Click here to manually set your token </ins> </i> </p>
            </div>
        </div>
    )
}
