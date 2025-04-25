"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox.tsx"
import { Button } from "@/components/ui/button.tsx"
import {ArrowUpDown} from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Student = {
    id: string
    name: string
    avatar_url: string
}

export const columns: ColumnDef<Student>[] = [
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
        header: ({ column }) => {
            return (
                <Button className={"sButton"}
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
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
        accessorKey: "id",
        header: "ID Test",
    },
]

