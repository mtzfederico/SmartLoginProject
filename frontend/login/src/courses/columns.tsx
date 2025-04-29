"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Button } from "@/components/ui/button.tsx"
import {ArrowUpDown} from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Course = {
    id: number
    name: string
    enrollment_term_id: number
}

export type GetCoursesResponse = {
    courses: Course[]
    success: boolean
    error: string | undefined
}

const termMap: Record<number, string> = {
    1: "Fall 2022",
    2: "Spring 2023",
    3: "Fall 2023",
    4: "Spring 2024",
    5: "Fall 2024",
    6: "Spring 2025",
}

export const columns: ColumnDef<Course>[] = [
    {
        id: "select",
        cell: ({ row, table }) => (
            <div style={{ marginLeft: "10px" }}>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllRowsSelected(false)
                        if (value) {
                            row.toggleSelected(true)
                        }
                    }}
                    aria-label="Select row"
                    style={{
                        width: "20px",
                        height: "35px",
                        minWidth: "20px",
                        minHeight: "35px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                />
            </div>
        )
        ,
        enableSorting: false,
        enableHiding: false,

    },
    {
        accessorKey: "name",
        header: "Course Name",
    },
    {
        accessorKey: "enrollment_term_id",
        header: ({ column }) => {
            return (
                <Button className={"sButton"}
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Semester
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const termID = row.getValue("enrollment_term_id") as number
            return termMap[termID] ?? `Unknown (${termID})`
        }
    },
    {
        accessorKey: "id",
        header: "Course ID",
    },
]

