'use client';

import React, { useState } from 'react';
import { updatePlatformSetting } from '@/app/actions/super-admin';
import toast from 'react-hot-toast';

export default function MaintenanceToggle({ initialState }: { initialState: boolean }) {
  const [isMaintenance, setIsMaintenance] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const toggleMaintenance = async () => {
    const nextState = !isMaintenance;
    
    if (nextState) {
      if (!confirm("Are you ABSOLUTELY sure you want to enable Maintenance Mode? This will block all users from accessing the site.")) {
        return;
      }
    }

    setLoading(true);
    try {
      await updatePlatformSetting('maintenance_mode', nextState, 'Locks the platform for maintenance');
      setIsMaintenance(nextState);
      toast.success(`Maintenance Mode ${nextState ? 'ENABLED' : 'DISABLED'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0">
      <button 
        onClick={toggleMaintenance}
        disabled={loading}
        className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-hidden ${
          isMaintenance ? 'bg-red-600' : 'bg-gray-600'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-8 w-8 transform rounded-full bg-[var(--color-gsp-surface-muted)] transition-transform ${
            isMaintenance ? 'translate-x-11' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
