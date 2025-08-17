export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export type Suggestion = {
  id: string;
  text: string;
  subtext: string;
};

export type Model = {
  id: string;
  name: string;
  description: string;
};
