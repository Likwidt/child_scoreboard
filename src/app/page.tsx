'use client';
import React, { useState, useEffect } from 'react';
import type { Task } from '../lib/tasks';

export default function ChildProgress() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function load() {
      const [taskRes, accountRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/account'),
      ]);
      const tasks = await taskRes.json();
      const { balance } = await accountRes.json();
      setTasks(tasks);
      setBalance(balance);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Progress</h1>
      <div className="mb-4 text-lg">Points Bank: <strong>{balance}</strong></div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {['Task', 'Pts', 'Done', 'Subtotal'].map(h => (
              <th key={h} className="border px-2 py-1 bg-gray-100">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(({ id, name, pts, count }) => (
            <tr key={id} className="even:bg-gray-50">
              <td className="border px-2 py-1">{name}</td>
              <td className="border px-2 py-1 text-center">{pts > 0 ? `+${pts}` : pts}</td>
              <td className="border px-2 py-1 text-center">{count}</td>
              <td className="border px-2 py-1 text-center">{(pts * count) > 0 ? `+${pts * count}` : pts * count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
