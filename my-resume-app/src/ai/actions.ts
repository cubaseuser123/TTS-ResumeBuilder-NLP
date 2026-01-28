import { generateObject } from 'ai';
import { geminiModel } from './client';
import {
    experienceSchema, educationSchema, skillSchema, projectSchema, textSchema,
    awardSchema, publicationSchema, volunteeringSchema, interestSchema
} from './schemas';
const SCHEMAS = {
    experience: experienceSchema,
    education: educationSchema,
    skills: skillSchema,
    projects: projectSchema,
    summary: textSchema,
    awards: awardSchema,
    publications: publicationSchema,
    volunteering: volunteeringSchema,
    interests: interestSchema,
} as const;


type SectionKey = keyof typeof SCHEMAS;

export const enhanceContent = async (
    sectionField: string,
    data: any
) => {
    console.group(`[AI Action] Enhancing ${sectionField}`);
    console.log("Raw Input:", data);

    if (!data) throw new Error("Inout is empty!");

    const isString = typeof data === 'string';
    const isEmptyObj = typeof data === 'object' && Object.keys(data).length === 0;

    if (isEmptyObj || (isString && !data.trim())) {
        console.warn("Validation Failed: Empty content");
        console.groupEnd();
        throw new Error('Cannot enhance empty content. Please add some details first.');
    }

    const normalizedKey = sectionField.toLowerCase() as SectionKey;
    console.log("Selected Schema Key:", normalizedKey);

    const schema = SCHEMAS[normalizedKey] || textSchema;

    const systemPrompt = `You are an expert Resume Enhancer.
    Your task is to rewrite the provided content to be professional, impactful, and concise.
    - Use strong action verbs.
    - Fix grammar and spelling.
    - Maintain the factual accuracy of the original content.
    - Do not invent new facts.
    - Tone: Natural, active, and human.
    - Use "I" statements or active verbs (e.g., "I designed and implemented" or "Built and deployed").
    - Avoid robotic "resume-speak" or overly stiff imperative sentence fragments.
    - Focus on telling a clear story of impact.
    - IMPORTANT: Return ONLY raw JSON. Do NOT use markdown code blocks (e.g., \`\`\`json). Do NOT add conversational text.`;

    console.time("Gemini Generation");
    try {
        const result = await generateObject({
            model: geminiModel,
            schema: schema,
            system: systemPrompt,
            prompt: `Original Content:\n${JSON.stringify(data, null, 2)}`,
        });

        console.timeEnd("Gemini Generation");
        console.log("Generated Object:", result.object);
        console.groupEnd();
        return result.object;
    } catch (err: any) {
        console.error('AI Generation Error', err);
        console.groupEnd();
        // Throw the real error message so the user sees it in the alert
        throw new Error(err.message || 'AI generation failed');
    }
};

