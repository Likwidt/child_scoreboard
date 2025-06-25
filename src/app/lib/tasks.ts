export interface Task {
  id: number;
  name: string;
  pts: number;
  count: number;
}

export const initialTasks: Task[] = [
  { id: 1, name: 'Doing daily checklist', pts: 3, count: 0 },
  { id: 2, name: 'Clean, fold, and put away laundry', pts: 8, count: 0 },
  { id: 3, name: 'Sweep and wipe down room', pts: 6, count: 0 },
  { id: 4, name: 'Take out the trash', pts: 6, count: 0 },
  { id: 5, name: 'Not wiping the toilet seat and flushing', pts: -1, count: 0 },
  { id: 6, name: 'Arguing with mom about going somewhere', pts: -3, count: 0 },
  { id: 7, name: 'Hiding soiled clothes', pts: -1, count: 0 },
];