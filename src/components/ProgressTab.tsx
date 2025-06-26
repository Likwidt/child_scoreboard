'use client';
import React, { useMemo } from 'react';
import type { Task } from '../lib/tasks';

interface ProgressTabProps {
  tasks: Task[];
}

export default function ProgressTab({ tasks }: ProgressTabProps) {
    const sortedTasks = useMemo(
      () => [...tasks].sort((a, b) => b.pts - a.pts),
      [tasks]
  );

  const totalEarned = useMemo(
    () => sortedTasks.reduce((sum, t) => sum + t.count * t.pts, 0),
    [sortedTasks]
  );

  return (
    <div className="border border-black/50 overflow-x-auto bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {['Task', 'Pts', 'Done', 'Subtotal'].map((h) => (
              <th key={h} className="px-2 py-1 bg-gray-100">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTasks.map(({ id, name, pts, count }) => (
            <tr key={id} className="even:bg-gray-50">
              <td className="px-2 py-1">{name}</td>
              <td className="px-2 py-1 text-center">{pts > 0 ? `+${pts}` : pts}</td>
              <td className="px-2 py-1 text-center">{count}</td>
              <td className="px-2 py-1 text-center">
                {(pts * count) > 0 ? `+${pts * count}` : pts * count}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="px-2 py-2 font-semibold text-right">
              Total:
            </td>
            <td className="px-2 py-2 font-semibold text-center">
              {totalEarned > 0 ? `+${totalEarned}` : totalEarned}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}