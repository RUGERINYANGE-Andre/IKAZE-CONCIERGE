// client/src/components/ui/StatusBadge.jsx

import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-status-pending/10',
      text: 'text-status-pending',
      label: 'Pending',
      icon: '⏳',
    },
    in_progress: {
      bg: 'bg-status-inProgress/10',
      text: 'text-status-inProgress',
      label: 'In Progress',
      icon: '🔄',
    },
    completed: {
      bg: 'bg-status-completed/10',
      text: 'text-status-completed',
      label: 'Completed',
      icon: '✅',
    },
    cancelled: {
      bg: 'bg-status-cancelled/10',
      text: 'text-status-cancelled',
      label: 'Cancelled',
      icon: '❌',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;