export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  projectId: string;
}
