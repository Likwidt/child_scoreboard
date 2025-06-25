'use client';
import React, { Suspense } from 'react';
import AdminDashboard from '../../components/AdminDashboard';

// Force client dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading admin...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}