# Vercel AI SDK v6 Reference (Web Research)

## Core Concepts
The Vercel AI SDK v6 is split into **Core** (`ai`) and **UI** (`@ai-sdk/react`, etc.).

### Structured Output (`generateObject`)
For generating JSON matching a specific schema, `generateObject` is the standard function in the Core API.

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

const result = await generateObject({
  model: google('gemini-1.5-flash'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

console.log(result.object.recipe.name);
```

### Client-Side Usage
While typically used on the server, SDK Core functions can run client-side if the provider allows it and the API key is available.
- **Experimental Hooks**: `experimental_useObject` (or `useObject`) allows streaming structure to the client from a server endpoint.
- **Direct Client Calls**: Calling `generateObject` directly in a browser component is less common due to key exposure but functionally possible for internal tools.

## Migration Notes
- Ensure `@ai-sdk/google` is installed for Gemini.
- Use `createGoogleGenerativeAI` if granular config is needed.
- `generateObject` replaces older `experimental_` functions or manual JSON parsing.

## Google Provider
```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
});
```
