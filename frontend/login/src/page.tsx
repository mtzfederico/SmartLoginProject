import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

import '@/Page.css'

export default function Page() {
    const navigate = useNavigate()

    return (
        <div className="body">
            <h1>Hello</h1>
            <main className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-4xl font-bold">Welcome</h1>
                <p className="text-lg text-gray-500">Start by submitting an ID</p>
                <Button onClick={() => navigate("/selection")}>Go to Selection Page</Button>
                <Button onClick={() => navigate("/course-selection")}>Go to Course Page</Button>
            </main>
        </div>
    )
}
