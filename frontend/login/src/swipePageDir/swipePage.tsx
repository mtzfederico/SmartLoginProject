import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendSwipe } from "@/TS Scripts/sendSwipe.ts";
import { registerAttendance } from "@/TS Scripts/registerAttendance.ts";

export default function SwipePage() {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(""); // Track error message
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCourse } = location.state || {};


    async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();

            const rawInput = inputValue.trim();
            const validCardPattern = /^;[0-9]{16}\?$/;

            // Validate format
            if (!validCardPattern.test(inputValue.trim())) {
                setError("Invalid card format. Please swipe your NYIT ID");
                return;
            }

            const cleanedCardID = rawInput.slice(1, -1); // Remove ';' and '?'

            try {
                const result = await sendSwipe(cleanedCardID);
                console.log(result);

                if (result.registered) {
                    await registerAttendance({
                        cardID: cleanedCardID,
                        courseID: selectedCourse.id,
                    });

                    setSuccessMessage("✅ You have been marked present!");
                    setTimeout(() => setSuccessMessage(""), 3000); // Clear after 3 seconds
                } else {
                    navigate("/selection", { state: { cardID: cleanedCardID, selectedCourse } });
                }

                setInputValue("");
                setError(""); // Clear any previous error
            } catch (error) {
                console.error("Error sending swipe:", error);
                setError("An error occurred. Please try again.");
            }
        }
    }

    if (!selectedCourse) {
        return <h1>No course selected, please return to the last page.</h1>;
    }

    return (
        <div className="swipePage">
            <div className="fixed-top">
                <h1 className="small-h1" style={{ marginTop: "1.2em", marginBottom: "1.2em" }}>
                    {selectedCourse.name}
                </h1>
            </div>

            <Input
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setError(""); // Clear error while typing
                }}
                onKeyDown={handleKeyDown}
                placeholder="Swipe card here..."
                className={"inputSearch"}
            />

            {error && (
                <div style={{ color: "red", marginTop: "0.5em", fontWeight: "bold" }}>
                    {error}
                </div>
            )}

            {successMessage && (
                <div style={{ color: "green", marginTop: "0.5em", fontWeight: "bold" }}>
                    {successMessage}
                </div>
            )}
        </div>
    );
}
