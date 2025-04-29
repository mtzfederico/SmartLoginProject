import { useEffect, useState } from "react"
import { Student, columns } from "@/students/columns.tsx"
import { DataTable } from "@/components/ui/data-table.tsx"
import {getStudents} from "@/TS Scripts/getStudentsWithNoID.ts";
import { useLocation } from "react-router-dom";

import '@/Page.css'

export default function SelectionPage() {
    const [data, setData] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const { cardID, selectedCourse } = location.state || {};  // Pull `cardID` passed from SwipePage

    useEffect(() => {
        getStudents(31905)
            .then((students) => setData(students))
            .catch((err) => console.error("Error fetching students:", err))
            .finally(() => setLoading(false))
    }, [])

    if (!cardID) {
        return <h1>No Card ID provided.</h1>;
    }

    if (loading) return <div className="p-10">Loading...</div>

    return (
        <div>
            <div className="fixed-top">
                <h1 className="small-h1"
                    style={{
                        marginTop: "1.2em", marginBottom: "1.2em"
                    }}
                >Link your card to your name, you will be marked present</h1>
            </div>
            <div className="table-container"
                 style={{
                     marginTop: "10em"
                 }}>
                <DataTable columns={columns} data={data} cardID={cardID} selectedCourse={selectedCourse} />
            </div>
        </div>
    )
}
