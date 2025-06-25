'use client';

import { useState, useMemo } from 'react';
import { initialTasks, Task } from './lib/tasks';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const changeCount = (id: number, delta: number) => {
    setTasks(current =>
      current.map(task =>
        task.id === id ? { ...task, count: task.count + delta } : task
      )
    );
  };

  const total = useMemo(
    () => tasks.reduce((sum, t) => sum + t.count * t.pts, 0),
    [tasks]
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chore & Behavior Points</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {['Task', 'Pts', 'Done', 'Actions', 'Subtotal'].map(header => (
              <th key={header} className="border px-2 py-1 bg-gray-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(({ id, name, pts, count }) => (
            <tr key={id} className="even:bg-gray-50">
              <td className="border px-2 py-1">{name}</td>
              <td className="border px-2 py-1 text-center">
                {pts > 0 ? `+${pts}` : pts}
              </td>
              <td className="border px-2 py-1 text-center">{count}</td>
              <td className="border px-2 py-1 text-center space-x-1">
                <button
                  onClick={() => changeCount(id, 1)}
                  className="px-2 py-0.5 border rounded hover:bg-green-100"
                >
                  +1
                </button>
                <button
                  onClick={() => changeCount(id, -1)}
                  className="px-2 py-0.5 border rounded hover:bg-red-100"
                >
                  –1
                </button>
              </td>
              <td className="border px-2 py-1 text-center">
                {(pts * count) > 0 ? `+${pts * count}` : pts * count}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border px-2 py-2 font-semibold text-right">
              Total:
            </td>
            <td className="border px-2 py-2 font-semibold text-center">
              {total > 0 ? `+${total}` : total}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Dashboard;