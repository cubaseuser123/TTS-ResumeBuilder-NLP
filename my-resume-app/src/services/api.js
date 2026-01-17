/**
 * API Service for connecting to the FastAPI backend
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Generate resume from prompt and accumulated answers
 * @param {string} prompt - The original prompt text
 * @param {Object} answers - Accumulated clarification answers
 * @returns {Promise<Object>} - Backend response
 */
export async function generateResume(prompt, answers = {}) {
    const response = await fetch(`${API_BASE_URL}/api/generate-resume`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt,
            answers,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export default { generateResume };
