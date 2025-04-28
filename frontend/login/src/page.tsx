import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { getSelf } from "@/TS Scripts/getSelf.ts"

import '@/Page.css'
import {useEffect, useState} from "react";

import appIcon from "@/assets/ScanMo.png";

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
            <main className="flex logoSplash">
                <img src={appIcon} style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "35%"
                }} alt="ScanMo Logo"/>
                <p className="text-lg text-gray-500">Connected to Canvas as {userName ? userName : "Loading..."}</p>
                <Button className="big-button logoSplash" onClick={() => navigate("/course-selection")}>
                    <div className="icon">🔔</div>
                    <div className="divider"></div>
                    <div className="subtitle">View Courses</div>
                </Button>
            </main>
        </div>
    )
}
