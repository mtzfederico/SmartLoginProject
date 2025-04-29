import { useEffect, useState } from "react"
import { getAttendance } from "@/TS Scripts/getAttendance.ts"
import {attendanceColumns, AttendanceData} from "@/courses/attendanceColumns.tsx" // 🆕 define your own columns for attendance
import { DataTable } from "@/components/ui/data-table-attendance.tsx"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"


import '@/Page.css'
import {useLocation} from "react-router-dom";
import {cn} from "@/lib/utils.ts";

export default function RecordsPage() {
    const [attendance, setAttendance] = useState<AttendanceData[]>([])
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const { selectedCourse } = location.state || {};  // Pull course info passed from CourseHome
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    // 🔧 Set your course ID here
    const [courseID] = useState<number>(selectedCourse.id)
    const [courseName] = useState<string>(selectedCourse.name)

    useEffect(() => {
        if (!courseID || !selectedDate) return;

        const fetchAttendance = async () => {
            setLoading(true);

            const yyyy = selectedDate.getFullYear();
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');

            const startDate = `${yyyy}-${mm}-${dd} 00:00:00`;
            const endDate = `${yyyy}-${mm}-${dd} 23:59:59`;

            const result = await getAttendance({ courseID, startDate, endDate });

            if (result.success && result.students) {
                const isPlaceholder = (val: string) => val === "--:--.--";

                const sorted = result.students.sort((a, b) => {
                    if (isPlaceholder(a.date) && !isPlaceholder(b.date)) return 1;
                    if (!isPlaceholder(a.date) && isPlaceholder(b.date)) return -1;
                    if (isPlaceholder(a.date) && isPlaceholder(b.date)) return 0;
                    return a.date.localeCompare(b.date); // or use custom parsing if needed
                });

                setAttendance(sorted);
            } else {
                console.error("Failed to get attendance:", result.error);
                setAttendance([]);
            }

            setLoading(false);
        };

        fetchAttendance();
    }, [courseID, selectedDate]);

    function getShortCourseName(): string {
        const nameSplit = courseName.split(' - ');
        const len = nameSplit.length;
        if (len >= 2) {
            // returns "Programming Language Concepts M01"
            return nameSplit[2] + " " + nameSplit[1];
        } else if (len === 1) {
            return nameSplit[1];
        }
        return courseName;
    }

    function exportCSVPressed() {
        if (!attendance || !selectedDate) {
            console.log("[exportCSVPressed] attendance or selectedDate undefined")
            return
        }

        const shortName = getShortCourseName();

        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');

        // https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
        var csvData = `# ${shortName} ${yyyy}-${mm}-${dd}\nName,Arrival Time,\n`
        attendance.forEach(function(value, _) {
			csvData += value.name + "," + (value.date === "--:--.--" ? "---" : value.date) + ",\n";
        })

        const element = document.createElement("a");
        const file = new Blob([csvData], {type: 'text/csv'});
        element.href = URL.createObjectURL(file);
        element.download = `attendance_${shortName.replace(' ', '_')}_${yyyy}-${mm}-${dd}.csv`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }


    if (loading) return <div className="p-10 text-white">Loading attendance...</div>

    return (
        <div>
            <div className="fixed-top">
                <h1 className="small-h1" style={{ marginTop: "1.2em", marginBottom: "0.5em" }}>
                    {courseName}
                </h1>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <button className={cn( "w-[280px] justify-start text-left font-normal", "text-muted-foreground")} onClick={exportCSVPressed}>
                    <span>Export to csv</span>
                </button>
            </div>
            <div className="table-container"
                 style={{
                     marginTop: "10em"
                 }}>
                <DataTable columns={attendanceColumns} data={attendance} />
            </div>
        </div>
    )
}
