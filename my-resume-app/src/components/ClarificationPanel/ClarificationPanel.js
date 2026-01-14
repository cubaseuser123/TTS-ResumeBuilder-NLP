import React from "react";
import "./ClarificationPanel.css";

/**
 * ClarificationPanel - Renders clarification questions from the backend
 * 
 * Props:
 * - questions: Array of question strings from backend
 * - answers: Object containing current answers
 * - onAnswerChange: function(questionIndex, value) - Callback when answer changes
 * - onSubmit: function() - Callback when user submits answers
 * - disabled: boolean - Whether inputs are disabled during submission
 */
const ClarificationPanel = ({
    questions,
    answers,
    onAnswerChange,
    onSubmit,
    disabled,
}) => {
    console.log("=== ClarificationPanel rendering ===");
    console.log("questions:", questions);
    console.log("questions length:", questions?.length);

    if (!questions || questions.length === 0) {
        console.log("ClarificationPanel: No questions, returning null");
        return null;
    }

    console.log("ClarificationPanel: Rendering with", questions.length, "questions");

    return (
        <div className="clarification-panel">
            <h3 className="section-title">Additional Information Needed</h3>
            <p className="clarification-description">
                Please provide the following information to complete your resume:
            </p>

            {questions.map((questionItem, index) => {
                // Handle both string questions and object questions { field, question }
                const questionText = typeof questionItem === "string"
                    ? questionItem
                    : (questionItem.question || questionItem.field || JSON.stringify(questionItem));
                const fieldKey = typeof questionItem === "object" && questionItem.field
                    ? questionItem.field
                    : `q_${index}`;

                return (
                    <div key={index} className="clarification-question">
                        <label className="input-label" htmlFor={`clarification-${index}`}>
                            {questionText}
                        </label>
                        <textarea
                            id={`clarification-${index}`}
                            className="text-input clarification-input"
                            value={answers[fieldKey] || ""}
                            onChange={(e) => onAnswerChange(fieldKey, e.target.value)}
                            disabled={disabled}
                            rows={2}
                            placeholder="Enter your answer..."
                        />
                    </div>
                );
            })}

            <button
                type="button"
                className="clarification-submit"
                style={{
                    backgroundColor: disabled ? "#6b7280" : "#404c7dff",
                    width: "100%",
                    border: "none",
                    height: "40px",
                    color: "white",
                    marginTop: "16px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                }}
                onClick={onSubmit}
                disabled={disabled}
            >
                {disabled ? "Submitting..." : "Submit Answers"}
            </button>
        </div>
    );
};

export default ClarificationPanel;
