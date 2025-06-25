// src/components/RewardsTab.tsx

'use client';
import React, { useState } from 'react';
import type { Reward } from '../lib/rewards';

interface RewardsTabProps {
  rewards: Reward[];
  balance: number;
  onPurchase: (reward: Reward) => Promise<void>;
}

type RewardOptions = 'all' | 'can_buy' | 'purchased' | 'not_purchased';
type SortOptions = 'none' | 'asc' | 'desc';

export default function RewardsTab({ rewards, balance, onPurchase }: RewardsTabProps) {
  // Filter and sort state
  const [filter, setFilter] = useState<RewardOptions>('all');
  const [sort, setSort] = useState<SortOptions>('none');

  // Apply filter
  const filtered = rewards.filter((r) => {
    const affordable = r.cost <= balance;
    const purchased = r.purchased;
    switch (filter) {
      case 'can_buy':
        return affordable && !purchased;
      case 'purchased':
        return purchased;
      case 'not_purchased':
        return !purchased;
      case 'all':
      default:
        return true;
    }
  });

  // Apply sort
  const sorted = [...filtered];
  if (sort === 'asc') {
    sorted.sort((a, b) => a.cost - b.cost);
  } else if (sort === 'desc') {
    sorted.sort((a, b) => b.cost - a.cost);
  }

  return (
    <div>
      {/* Controls: filter and sort */}
      <div className="flex items-center mb-4 space-x-6">
        <div className="flex items-center">
          <label htmlFor="rewardFilter" className="mr-2 font-medium">Show:</label>
          <select
            id="rewardFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as RewardOptions)}
            className="border rounded p-1"
          >
            <option value="all">All</option>
            <option value="can_buy">Can buy</option>
            <option value="purchased">Purchased</option>
            <option value="not_purchased">Not purchased</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="rewardSort" className="mr-2 font-medium">Sort:</label>
          <select
            id="rewardSort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOptions)}
            className="border rounded p-1"
          >
            <option value="none">Neutral</option>
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </select>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((r) => {
          const affordable = r.cost <= balance;
          const purchased = r.purchased;
          return (
            <div key={r.id} className="relative">
              <div
                className={`border p-4 rounded-lg shadow-sm ${(!affordable || purchased) ? 'opacity-50' : ''}`}
              >
                {r.imageUrl && (
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="mb-2 w-full h-32 object-cover rounded"
                  />
                )}
                <h3 className="text-lg font-medium">{r.title}</h3>
                <p className="text-gray-700 mb-2">{r.description}</p>
                <p className="font-semibold mb-2">Cost: {r.cost} points</p>
                <button
                  onClick={() => onPurchase(r)}
                  disabled={!affordable || purchased}
                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchased ? 'Purchased' : 'Purchase'}
                </button>
              </div>
              {purchased && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="transform rotate-45 text-white bg-red-600 bg-opacity-75 px-4 py-1 text-lg font-bold uppercase">
                    PURCHASED
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
