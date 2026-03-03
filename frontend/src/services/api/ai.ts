import api from "../httpClient";

export interface PiStatusResponse {
  active: boolean;
  msg?: string;
}

export interface PiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface PiChatResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  [key: string]: unknown;
}

export const getPiStatus = async (): Promise<PiStatusResponse> => {
  const response = await api.get<PiStatusResponse>("/api/pi/status");
  return response.data;
};

export const chatWithPi = async (
  messages: PiChatMessage[],
  model: string = "gpt-4"
): Promise<PiChatResponse> => {
  const response = await api.post<PiChatResponse>("/api/pi/chat", {
    messages,
    model,
  });
  return response.data;
};
