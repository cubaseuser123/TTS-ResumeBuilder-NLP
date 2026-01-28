import { z } from 'zod';

export const experienceSchema = z.object({
    expCompany: z.string().describe("Company Name"),
    expPosition: z.string().describe("Job Title"),
    expDate: z.string().describe("Dates (e.g., 'Jan 2020 - Present')"),
    expLocation: z.string().describe("City, Country"),
    expSummary: z.string().describe("Professional summary (no bullet points)."),
});


export const educationSchema = z.object({
    eduInstitute: z.string().describe("University Name"),
    eduType: z.string().describe("Degree type"),
    eduScore: z.string().describe("GPA/Score"),
    eduDate: z.string().describe("Graduation Year"),
    eduSummary: z.string().describe("Description"),
});

export const skillSchema = z.object({
    skillName: z.string(),
    skillDescription: z.string(),
    skillKeyword: z.string(),
    skillLevel: z.number(),
});

export const projectSchema = z.object({
    projectName: z.string(),
    projectDescription: z.string(),
    projectWebsite: z.string().optional(),
    projectSummary: z.string(),
});

export const textSchema = z.object({
    content: z.string().describe("The enhanced text content"),
});


// 6. Awards
export const awardSchema = z.object({
    awardTitle: z.string().describe("Name of the award"),
    awardDate: z.string().describe("Date received"),
    awardSummary: z.string().describe("Description of the achievement"),
});

// 7. Publications
export const publicationSchema = z.object({
    publicationName: z.string().describe("Title of publication"),
    publicationPublisher: z.string().describe("Publisher/Journal"),
    publicationDate: z.string().describe("Date"),
    publicationSummary: z.string().describe("Summary of the work"),
});

// 8. Volunteering
export const volunteeringSchema = z.object({
    volOrg: z.string().describe("Organization"),
    volPosition: z.string().describe("Role/Position"),
    volDate: z.string().describe("Dates"),
    volLocation: z.string().describe("Location"),
    volSummary: z.string().describe("Description of service"),
});

// 9. Interests
export const interestSchema = z.object({
    interestName: z.string().describe("Name of interest or hobby"),
});