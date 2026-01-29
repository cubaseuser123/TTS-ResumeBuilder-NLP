import React, { useState, useEffect } from "react";
import "./LoadingProgress.css";

/**
 * LoadingProgress - Animated progress bar with dynamic status messages
 * 
 * Props:
 * - isActive: boolean - Whether the loading is active
 * - duration: number - Total duration in ms (default: 8000)
 * - onComplete: function - Callback when progress reaches 100%
 */
const LoadingProgress = ({ isActive, duration = 8000, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");

    // Status messages at different progress hitpoints
    const statusMessages = [
        { threshold: 0, text: "Initializing AI pipeline..." },
        { threshold: 15, text: "Understanding your profile..." },
        { threshold: 30, text: "Extracting key information..." },
        { threshold: 45, text: "Analyzing skills & experience..." },
        { threshold: 60, text: "Generating resume structure..." },
        { threshold: 75, text: "Enhancing with AI..." },
        { threshold: 90, text: "Final polish & formatting..." },
        { threshold: 98, text: "Almost there..." },
    ];

    // Get status text based on current progress
    const getStatusText = (currentProgress) => {
        let message = statusMessages[0].text;
        for (const status of statusMessages) {
            if (currentProgress >= status.threshold) {
                message = status.text;
            }
        }
        return message;
    };

    // Animate progress when active
    useEffect(() => {
        if (!isActive) {
            setProgress(0);
            setStatusText("");
            return;
        }

        setStatusText(getStatusText(0));

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(newProgress);
            setStatusText(getStatusText(newProgress));

            if (newProgress >= 100) {
                clearInterval(interval);
                if (onComplete) {
                    onComplete();
                }
            }
        }, 50); // Update every 50ms for smooth animation

        return () => clearInterval(interval);
    }, [isActive, duration, onComplete]);

    if (!isActive) return null;

    return (
        <div className="loading-progress-container">
            <div className="loading-progress-bar-wrapper">
                <div
                    className="loading-progress-bar"
                    style={{ width: `${progress}%` }}
                />
                <div className="loading-progress-glow" style={{ width: `${progress}%` }} />
            </div>

            <div className="loading-progress-info">
                <span className="loading-progress-percent">{Math.round(progress)}%</span>
                <span className="loading-progress-status">{statusText}</span>
            </div>
        </div>
    );
};

export default LoadingProgress;
