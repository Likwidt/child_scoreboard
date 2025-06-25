'use client';
import React, { useState, useEffect } from 'react';
import ProgressTab from '../components/ProgressTab';
import RewardsTab from '../components/RewardsTab';
import type { Task } from '../lib/tasks';
import type { Reward } from '../lib/rewards';

export default function ChildProgress() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards'>('tasks');

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

  const handlePurchase = async (reward: Reward) => {
    // Spend on account
    await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spend: reward.cost }),
    });
    // Mark reward purchased
    await fetch(`/api/rewards/${reward.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchased: true }),
    });
    fetchData();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <div className="text-lg">
          Points Bank: <strong>{balance}</strong>
        </div>
      </header>

      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 -mb-px font-medium ${
            activeTab === 'tasks'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`ml-4 px-4 py-2 -mb-px font-medium ${
            activeTab === 'rewards'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('rewards')}
        >
          Rewards
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <ProgressTab tasks={tasks} />
      ) : (
        <RewardsTab rewards={rewards} balance={balance} onPurchase={handlePurchase} />
      )}
    </div>
  );
}