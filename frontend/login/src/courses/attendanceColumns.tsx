"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AttendanceData = {
    id: number
    name: string
    avatar_url: string
    date: string
}

export type GetCoursesResponse = {
    courses: AttendanceData[]
    success: boolean
    error: string | undefined
}

export const attendanceColumns: ColumnDef<AttendanceData>[] = [
    {
        accessorKey: "name",
        header: "Student Name",
        cell: ({ row }) => {
            const avatar = row.original.avatar_url as string
            const name = row.getValue("name") as string
            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", marginRight: "15px" }}>
                        <img
                            src={avatar}
                            alt="Avatar"
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "9999px",
                                border: "2px solid #333",
                                backgroundColor: "#222"
                            }}
                        />
                    </div>
                    <div>
                        {name}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "date",
        header: "Marked Attendance",
        cell: ({ row }) => {
            const rawDate = row.getValue("date") as string;

            if (rawDate === "--:--.--") {
                row._valuesCache.__invalid = true;
                return <span>{rawDate}</span>;
            }

            const time = new Date(rawDate).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });

            return <span>{time}</span>;
        },
    }

]

