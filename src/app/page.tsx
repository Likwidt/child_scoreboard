'use client';
import React, { useState, useEffect, useMemo } from 'react';
import type { Task } from '../lib/tasks';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formName, setFormName] = useState('');
  const [formPts, setFormPts] = useState(0);

  const fetchData = async () => {
    const [taskRes, accountRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/account'),
    ]);
    const tasks = await taskRes.json();
    const { balance } = await accountRes.json();
    setTasks(tasks);
    setBalance(balance);
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setModalMode('add'); setCurrentTask(null); setFormName(''); setFormPts(0); setModalOpen(true);
  };
  const openEditModal = (task: Task) => {
    setModalMode('edit'); setCurrentTask(task); setFormName(task.name); setFormPts(task.pts); setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const url = modalMode === 'add' ? '/api/tasks' : `/api/tasks/${currentTask?.id}`;
    await fetch(url, {
      method: modalMode === 'add' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modalMode === 'add' ? { name: formName.trim(), pts: formPts } : { name: formName.trim(), pts: formPts }),
    });
    closeModal(); fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const changeCount = async (id: number, delta: number) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    });
    const { balance } = await res.json();
    setBalance(balance);
    const data = await res.json();
    setTasks(data.tasks || data);
  };

  const total = useMemo(() => tasks.reduce((sum, t) => sum + t.count * t.pts, 0), [tasks]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chore & Behavior Points</h1>
      <div className="mb-4 text-lg">Current Balance: <strong>{balance}</strong></div>
      <button onClick={openAddModal} className="mb-4 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Add Task</button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{modalMode === 'add' ? 'Add Task' : 'Edit Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full border px-2 py-1 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points</label>
                <input type="number" value={formPts} onChange={e => setFormPts(parseInt(e.target.value, 10) || 0)} className="w-full border px-2 py-1 rounded" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full border-collapse">
        <thead>
          <tr>{['Task','Pts','Done','Actions','Subtotal'].map(h => <th key={h} className="border px-2 py-1 bg-gray-100">{h}</th>)}</tr>
        </thead>
        <tbody>
          {tasks.map(({ id, name, pts, count }) => (
            <tr key={id} className="even:bg-gray-50">
              <td className="border px-2 py-1">{name}</td>
              <td className="border px-2 py-1 text-center">{pts>0?`+${pts}`:pts}</td>
              <td className="border px-2 py-1 text-center">{count}</td>
              <td className="border px-2 py-1 text-center space-x-1">
                <button onClick={()=>changeCount(id,1)} className="px-2 py-0.5 border rounded hover:bg-green-100">+1</button>
                <button onClick={()=>changeCount(id,-1)} className="px-2 py-0.5 border rounded hover:bg-red-100">–1</button>
                <button onClick={()=>openEditModal({id,name,pts,count})} className="px-2 py-0.5 border rounded hover:bg-yellow-100">Edit</button>
                <button onClick={()=>handleDelete(id)} className="px-2 py-0.5 border rounded hover:bg-red-200">Delete</button>
              </td>
              <td className="border px-2 py-1 text-center">{(pts*count)>0?`+${pts*count}`:pts*count}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border px-2 py-2 font-semibold text-right">Total:</td>
            <td className="border px-2 py-2 font-semibold text-center">{total>0?`+${total}`:total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Dashboard;
