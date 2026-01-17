import React, { useRef, useEffect } from "react";
import "./PromptBox.css";


const PromptBox = ({ value, onChange, onSubmit, errorMessage, disabled }) => {
    const textareaRef = useRef(null);

    // Auto-grow textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to recalculate
            textarea.style.height = "auto";
            // Set to scrollHeight, but respect max-height via CSS
            const newHeight = Math.min(textarea.scrollHeight, 200);
            textarea.style.height = `${Math.max(newHeight, 80)}px`;
        }
    }, [value]);

    const handleChange = (e) => {
        if (onChange && !disabled) {
            onChange(e.target.value);
        }
    };

    const handleSubmitClick = () => {
        if (onSubmit && !disabled) {
            onSubmit();
        }
    };

    // Button is disabled if textarea is empty OR pipeline is running
    const isButtonDisabled = !value || value.trim() === "" || disabled;

    return (
        <div className="prompt-box-container">
            <h3 className="section-title">
                <label htmlFor="ai-prompt-input">AI Prompt</label>
            </h3>

            <textarea
                id="ai-prompt-input"
                ref={textareaRef}
                className="prompt-box-textarea"
                value={value || ""}
                onChange={handleChange}
                disabled={disabled}
                placeholder="All fields shown in the center preview must be provided."
                aria-describedby={errorMessage ? "ai-prompt-error" : undefined}
            />

            {/* Reserved error slot - always present to prevent layout shift */}
            <div className="prompt-box-error-slot">
                {errorMessage && (
                    <span id="ai-prompt-error" className="prompt-box-error-text">
                        {errorMessage}
                    </span>
                )}
            </div>

            {/* Submit button - styled to match other buttons */}
            <button
                type="button"
                className="prompt-box-submit"
                disabled={isButtonDisabled}
                style={{
                    backgroundColor: isButtonDisabled ? "#6b7280" : "#404c7dff",
                    width: "100%",
                    border: "none",
                    height: "40px",
                    color: "white",
                    marginBottom: "30px",
                    marginTop: "2px",
                    borderRadius: "8px",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                    opacity: isButtonDisabled ? 0.6 : 1,
                }}
                onClick={handleSubmitClick}
            >
                {disabled ? "Generating..." : "Submit Prompt"}
            </button>
        </div>
    );
};

export default PromptBox;

