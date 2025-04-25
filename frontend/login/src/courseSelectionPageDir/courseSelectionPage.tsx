import { useEffect, useState } from "react"
import { Course, columns } from "@/courses/columns.tsx"
import { DataTable } from "@/components/ui/data-table-courses.tsx"
import {getCourses} from "@/courses/getCourses.ts";

import '@/Page.css'

export default function SelectionPage() {
    const [data, setData] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCourses() // ← now correctly uses your imported function
            .then((courses) => setData(courses))
            .catch((err) => console.error("Error fetching courses:", err))
            .finally(() => setLoading(false))
    }, [])


    if (loading) return <div className="p-10">Loading...</div>

    return (
        <>
            <div className="table-container">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}
