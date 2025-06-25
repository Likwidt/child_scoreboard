import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Task } from '../lib/tasks';
import type { Reward } from '../lib/rewards';

export default function AdminDashboard() {
  // Authentication via secret key
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const SECRET = process.env.NEXT_PUBLIC_ADMIN_KEY;

  // Hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [balance, setBalance] = useState(0);
  const [loadingTaskIds, setLoadingTaskIds] = useState<number[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tName, setTName] = useState('');
  const [tPts, setTPts] = useState(0);

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rTitle, setRTitle] = useState('');
  const [rDesc, setRDesc] = useState('');
  const [rCost, setRCost] = useState(0);
  const [rImage, setRImage] = useState('');

  // Fetch data
  const fetchData = async () => {
    const [tRes, aRes, rRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/account'),
      fetch('/api/rewards'),
    ]);
    const tasks: Task[] = await tRes.json();
    const { balance } = await aRes.json();
    const rewards: Reward[] = await rRes.json();
    setTasks(tasks);
    setBalance(balance);
    setRewards(rewards);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Task modals
  const openAddTask = () => {
    setEditingTask(null);
    setTName('');
    setTPts(0);
    setShowTaskModal(true);
  };
  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTName(task.name);
    setTPts(task.pts);
    setShowTaskModal(true);
  };
  const closeTaskModal = () => setShowTaskModal(false);

  // Task submit
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: tName.trim(), pts: tPts };
    if (!payload.name) return;
    const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
    const method = editingTask ? 'PATCH' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    closeTaskModal();
    fetchData();
  };

  // Change count
  const changeCount = async (id: number, delta: number) => {
    setLoadingTaskIds(ids => [...ids, id]);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      const { tasks: updatedTasks, balance: updatedBalance } = await res.json();
      setTasks(updatedTasks);
      setBalance(updatedBalance);
    } finally {
      setLoadingTaskIds(ids => ids.filter(x => x !== id));
    }
  };

  // Delete task
  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete task?')) return;
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Reward modals
  const openAddReward = () => {
    setEditingReward(null);
    setRTitle('');
    setRDesc('');
    setRCost(0);
    setRImage('');
    setShowRewardModal(true);
  };
  const openEditReward = (r: Reward) => {
    setEditingReward(r);
    setRTitle(r.title);
    setRDesc(r.description);
    setRCost(r.cost);
    setRImage(r.imageUrl ?? '');
    setShowRewardModal(true);
  };
  const closeRewardModal = () => setShowRewardModal(false);

  // Reward submit
  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: rTitle.trim(), description: rDesc.trim(), cost: rCost, imageUrl: rImage || undefined };
    if (!payload.title || !payload.description) return;
    const url = editingReward ? `/api/rewards/${editingReward.id}` : '/api/rewards';
    const method = editingReward ? 'PATCH' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    closeRewardModal();
    fetchData();
  };

  // Delete reward
  const handleDeleteReward = async (id: number) => {
    if (!confirm('Delete reward?')) return;
    await fetch(`/api/rewards/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Totals
  const totalTasks = useMemo(() => tasks.reduce((sum, t) => sum + t.count * t.pts, 0), [tasks]);

    // Guard unauthorized
  if (key !== SECRET) {
    return (
      <div className="text-center text-red-500 mt-8">
        Unauthorized. Invalid key.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 text-lg">Points Bank: <strong>{balance}</strong></div>

      {/* Tasks Section */}
      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      <button onClick={openAddTask} className="mb-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Add Task</button>
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">{editingTask ? 'Edit Task' : 'Add Task'}</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Description</label>
                <input type="text" className="w-full border p-2 rounded" value={tName} onChange={e => setTName(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1">Points</label>
                <input type="number" className="w-full border p-2 rounded" value={tPts} onChange={e => setTPts(parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeTaskModal} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="min-w-full border-collapse mb-6">
        <thead><tr>{['Task','Pts','Done','Actions','Subtotal'].map(h=><th key={h} className="border px-2 py-1 bg-gray-100">{h}</th>)}</tr></thead>
        <tbody>
          {tasks.map(({ id, name, pts, count })=> (
            <tr key={id} className="even:bg-gray-50">
              <td className="border px-2 py-1">{name}</td>
              <td className="border px-2 py-1 text-center">{pts>0?`+${pts}`:pts}</td>
              <td className="border px-2 py-1 text-center">{count}</td>
              <td className="border px-2 py-1 text-center space-x-1">
                <button disabled={loadingTaskIds.includes(id)} onClick={()=>changeCount(id,1)} className="px-2 py-0.5 border rounded hover:bg-green-100">+1</button>
                <button disabled={loadingTaskIds.includes(id)} onClick={()=>changeCount(id,-1)} className="px-2 py-0.5 border rounded hover:bg-red-100">–1</button>
                <button disabled={loadingTaskIds.includes(id)} onClick={()=>openEditTask({id,name,pts,count})} className="px-2 py-0.5 border rounded hover:bg-yellow-100">Edit</button>
                <button disabled={loadingTaskIds.includes(id)} onClick={()=>handleDeleteTask(id)} className="px-2 py-0.5 border rounded hover:bg-red-200">Delete</button>
              </td>
              <td className="border px-2 py-1 text-center">{(pts*count)>0?`+${pts*count}`:pts*count}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><td colSpan={4} className="border px-2 py-2 font-semibold text-right">Total:</td><td className="border px-2 py-2 font-semibold text-center">{totalTasks>0?`+${totalTasks}`:totalTasks}</td></tr></tfoot>
      </table>

      <hr className="my-6" />

      {/* Rewards Section */}
      <h2 className="text-xl font-semibold mb-2">Rewards</h2>
      <button onClick={openAddReward} className="mb-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">Add Reward</button>
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">{editingReward ? 'Edit Reward' : 'Add Reward'}</h3>
            <form onSubmit={handleRewardSubmit} className="space-y-4">
              <div><label className="block mb-1">Title</label><input className="w-full border p-2 rounded" value={rTitle} onChange={e=>setRTitle(e.target.value)} /></div>
              <div><label className="block mb-1">Description</label><textarea className="w-full border p-2 rounded" value={rDesc} onChange={e=>setRDesc(e.target.value)} /></div>
              <div><label className="block mb-1">Cost</label><input type="number" className="w-full border p-2 rounded" value={rCost} onChange={e=>setRCost(parseInt(e.target.value,10)||0)} /></div>
              <div><label className="block mb-1">Image URL</label><input className="w-full border p-2 rounded" value={rImage} onChange={e=>setRImage(e.target.value)} placeholder="https://..." /></div>
              <div className="flex justify-end space-x-2"><button type="button" onClick={closeRewardModal} className="px-3 py-1 border rounded">Cancel</button><button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button></div>
            </form>
          </div>
        </div>
      )}
      <table className="min-w-full border-collapse">
        <thead><tr>{['Title','Description','Cost','Image','Actions'].map(h=><th key={h} className="border px-2 py-1 bg-gray-100">{h}</th>)}</tr></thead>
        <tbody>
          {rewards.map(r=>(
            <tr key={r.id} className="even:bg-gray-50">
              <td className="border px-2 py-1">{r.title}</td>
              <td className="border px-2 py-1">{r.description}</td>
              <td className="border px-2 py-1 text-center">{r.cost}</td>
              <td className="border px-2 py-1">{r.imageUrl ? <img src={r.imageUrl} alt={r.title} className="h-16 mx-auto" /> : '-'}</td>
              <td className="border px-2 py-1 text-center space-x-2"><button onClick={()=>openEditReward(r)} className="px-2 py-0.5 border rounded hover:bg-yellow-100">Edit</button><button onClick={()=>handleDeleteReward(r.id)} className="px-2 py-0.5 border rounded hover:bg-red-200">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
