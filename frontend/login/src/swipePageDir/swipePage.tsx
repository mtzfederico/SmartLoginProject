import { Input } from "@/components/ui/input.tsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendSwipe } from "@/TS Scripts/sendSwipe.ts";
import { registerAttendance } from "@/TS Scripts/registerAttendance.ts";
import swipeIcon from "@/assets/SwipeIcon.ico";
import {Button} from "@/components/ui/button.tsx";

export default function SwipePage() {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCourse } = location.state || {};
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const focusInput = () => {
            inputRef.current?.focus();
        };

        focusInput();
        window.addEventListener("click", focusInput);

        return () => {
            window.removeEventListener("click", focusInput);
        };
    }, []);

    async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            const rawInput = inputValue.trim();
            const validCardPattern = /^;[0-9]{16}\?$/;

            if (!validCardPattern.test(rawInput)) {
                setError("Invalid card format. Please swipe your NYIT ID");
                setInputValue("");
                return;
            }

            const cleanedCardID = rawInput.slice(1, -1); // Remove ';' and '?'

            try {
                const result = await sendSwipe(cleanedCardID);
                if (result.registered) {
                    await registerAttendance({
                        cardID: cleanedCardID,
                        courseID: selectedCourse.id,
                    });
                    setSuccessMessage("✅ You have been marked present!");
                    setTimeout(() => setSuccessMessage(""), 3000);
                } else {
                    navigate("/selection", { state: { cardID: cleanedCardID, selectedCourse } });
                }

                setInputValue("");
                setError("");
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
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="Swipe card here..."
                className="invisible-input"
                autoFocus
            />

            <Button className="big-button uninteractable-override">
                <img src={swipeIcon} style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "11em",
                    margin: "3.5em",
                }} alt="Course Icon"/>
                <div className="divider"></div>
                <div className="subtitle">Swipe your NYIT ID face up and away from you</div>
            </Button>

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
