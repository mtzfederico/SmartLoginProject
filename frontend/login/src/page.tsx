import { useEffect, useState } from "react"
import { Student, columns } from "./students/columns.tsx"
import { DataTable } from "./students/data-table.tsx"
import {getData} from "./students/getData.ts";

import '@/Page.css'

export default function DemoPage() {
    const [data, setData] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getData(31905)
            .then((students) => setData(students))
            .catch((err) => console.error("Error fetching students:", err))
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
