// Episode related types
export interface Episode {
  id: string;
  number: number;
  title: string;
  description?: string;
  deadline?: string;
  videoUrl?: string;
  completed: boolean;
}