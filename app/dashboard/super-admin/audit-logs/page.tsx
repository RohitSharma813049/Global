import React from 'react';
import { getAuditLogs } from '@/app/actions/super-admin';
import { format } from 'date-fns';

export default async function AuditLogsPage() {
  const logs = await getAuditLogs(100);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--color-gsp-text-primary) mb-2">Audit Logs</h1>
        <p className="text-(--color-gsp-text-secondary)">Chronological record of all administrative actions taken on the platform.</p>
      </div>

      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-(--color-gsp-text-secondary)">
            <thead className="bg-(--color-gsp-surface-raised) text-(--color-gsp-text-primary) font-semibold uppercase text-xs border-b border-(--color-gsp-border-muted)">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="hover:bg-(--color-gsp-surface-raised) transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-(--color-gsp-text-secondary)">
                    {log.created_at ? format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-(--color-gsp-text-primary)">{(log.users?.raw_user_meta_data as any)?.full_name || 'Unknown User'}</div>
                    <div className="text-xs text-(--color-gsp-text-secondary)">{log.users?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-soft text-indigo-700 border border-indigo-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.entity ? (
                      <div className="text-(--color-gsp-text-primary)">
                        <span className="text-(--color-gsp-text-secondary)">{log.entity}:</span> {log.entity_id}
                      </div>
                    ) : (
                      <span className="text-(--color-gsp-text-secondary)">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-(--color-gsp-text-secondary) max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-(--color-gsp-text-secondary)">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
