import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { getSelf } from "@/TS Scripts/getSelf.ts"

import '@/Page.css'
import {useEffect, useState} from "react";

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
            <main className="flex logoSplasH">
                <h1 className="logoSplash">Helo</h1>
                <h1 className="text-4xl font-bold">Landing</h1>
                <h1 className="text-4xl font-bold">Page!!</h1>
                <p className="text-lg text-gray-500">Connected to Canvas as {userName ? userName : "Loading..."}</p>
                <Button className={"button button-large"} onClick={() => navigate("/course-selection")}>View Courses</Button>
            </main>
        </div>
    )
}
