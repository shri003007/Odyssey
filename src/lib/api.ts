export type ApiResponse = {
  status: 'success' | 'error' | 'invalid_request';
  content?: string;
  message?: string;
  original_format?: string;
}

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE || 'http://localhost:8001';

export async function improveWriting(content: string, selectedText: string): Promise<ApiResponse> {
  const response = await fetch(`${AI_SERVICE_URL}/improve-writing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, selectedText }),
  });
  return response.json();
}

export async function changeTone(content: string, selectedText: string, targetTone: string): Promise<ApiResponse> {
  const response = await fetch(`${AI_SERVICE_URL}/change-tone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, selectedText, targetTone }),
  });
  return response.json();
}

export async function adjustLength(content: string, selectedText: string, targetLength: string): Promise<ApiResponse> {
  const response = await fetch(`${AI_SERVICE_URL}/adjust-length`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, selectedText, targetLength }),
  });
  return response.json();
}

export async function repurposeContent(content: string, targetFormat: string): Promise<ApiResponse> {
  const response = await fetch(`${AI_SERVICE_URL}/repurpose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, targetFormat }),
  });
  return response.json();
}

export async function simplifyLanguage(content: string, selectedText: string): Promise<ApiResponse> {
  const response = await fetch(`${AI_SERVICE_URL}/simplify-language`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, selectedText }),
  });
  return response.json();
}

export async function editSelection(
  content: string, 
  selectedText: string, 
  userInput: string
): Promise<ApiResponse> {
  const response = await fetch(`${AI_SERVICE_URL}/edit-selection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, selectedText, user_input: userInput }),
  });
  return response.json();
}

