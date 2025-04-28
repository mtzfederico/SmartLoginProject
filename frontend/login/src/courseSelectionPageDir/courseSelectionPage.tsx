import { useEffect, useState } from "react"
import { Course, columns } from "@/courses/columns.tsx"
import { DataTable } from "@/components/ui/data-table-courses.tsx"
import { getCourses } from "@/TS Scripts/getCourses.ts";

import '@/Page.css'

export default function SelectionPage() {
    const [data, setData] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCourses()
            .then((courses) => {
                // Sort courses by a specific field, e.g., "name" in ascending order
                const sortedCourses = courses.sort((a, b) =>
                    parseInt(b.enrollment_term_id) - parseInt(a.enrollment_term_id)
                );

                setData(sortedCourses);
            })
            .catch((err) => console.error("Error fetching courses:", err))
            .finally(() => setLoading(false))
    }, [])



    if (loading) return <div className="p-10" style={{ color: "#FFFFF" }}>Loading...</div>

    return (
        <>
            <div className="table-container">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}
