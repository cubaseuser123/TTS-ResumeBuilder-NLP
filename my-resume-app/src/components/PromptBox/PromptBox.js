import React, { useRef, useEffect, useState } from "react";
import "./PromptBox.css";

/**
 * Props:
 * - value: string - The current textarea value
 * - onChange: function(newValue) - Callback when value changes
 * - onSubmit: function() - Callback when submit button is clicked
 * - showHelperText: boolean - Whether to display helper text
 * - errorMessage: string - Error text to display (empty = no error)
 */
const PromptBox = ({ value, onChange, onSubmit, showHelperText, errorMessage }) => {
    const textareaRef = useRef(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleSubmitClick = () => {
        if (onSubmit && !isSubmitted) {
            setIsSubmitted(true);
            onSubmit();
        }
    };

    // Button is disabled if textarea is empty or already submitted
    const isButtonDisabled = !value || value.trim() === "" || isSubmitted;

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
                placeholder="All fields shown in the center preview must be provided."
                aria-describedby={
                    showHelperText || errorMessage
                        ? "ai-prompt-helper ai-prompt-error"
                        : undefined
                }
            />

            {showHelperText && (
                <span id="ai-prompt-helper" className="prompt-box-helper-text">
                    All fields shown in the center preview must be provided.
                </span>
            )}

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
                {isSubmitted ? "Submitted" : "Submit Prompt"}
            </button>
        </div>
    );
};

export default PromptBox;
