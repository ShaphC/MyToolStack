 export const extractionPrompt = (
  text: string
) => `
Extract structured work information.

Return ONLY valid JSON.

{
  "summary": "",
  "clients": [],
  "locations": [],
  "equipment": [],
  "tasks": [],
  "issues": []
}

INPUT:
${text}
`;

export const rewritePrompt = (
  text: string
) => `
Rewrite professionally.

Keep concise.

INPUT:
${text}
`;