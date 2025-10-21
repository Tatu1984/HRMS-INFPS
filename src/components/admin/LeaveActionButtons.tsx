'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LeaveActionButtonsProps {
  leaveId: string;
  currentStatus: string;
}

export function LeaveActionButtons({ leaveId, currentStatus }: LeaveActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this leave request?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leaves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leaveId, status }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to update leave');
        return;
      }

      router.refresh();
    } catch (error) {
      alert('Failed to update leave');
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'PENDING') {
    return <span className="text-sm text-gray-500">-</span>;
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 hover:bg-green-50"
        onClick={() => handleAction('APPROVED')}
        disabled={loading}
      >
        <CheckCircle className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:bg-red-50"
        onClick={() => handleAction('REJECTED')}
        disabled={loading}
      >
        <XCircle className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-yellow-600 hover:bg-yellow-50"
        onClick={() => handleAction('HOLD')}
        disabled={loading}
      >
        <Clock className="w-4 h-4" />
      </Button>
    </div>
  );
}
