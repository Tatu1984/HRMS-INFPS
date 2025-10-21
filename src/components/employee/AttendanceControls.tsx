'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AttendanceControlsProps {
  attendance: {
    id: string;
    punchIn: Date | null;
    punchOut: Date | null;
    breakStart: Date | null;
    breakEnd: Date | null;
  } | null;
}

export function AttendanceControls({ attendance }: AttendanceControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'punch-in' | 'punch-out' | 'break-start' | 'break-end') => {
    setLoading(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to update attendance');
        return;
      }

      router.refresh();
    } catch (error) {
      alert('Failed to update attendance');
    } finally {
      setLoading(false);
    }
  };

  const hasPunchedIn = attendance?.punchIn && !attendance?.punchOut;
  const onBreak = attendance?.breakStart && !attendance?.breakEnd;

  return (
    <div className="flex items-center gap-4">
      {!attendance?.punchIn ? (
        <Button
          onClick={() => handleAction('punch-in')}
          disabled={loading}
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          <Clock className="w-4 h-4 mr-2" />
          Punch In
        </Button>
      ) : !attendance?.punchOut ? (
        <>
          {!onBreak ? (
            <Button
              onClick={() => handleAction('break-start')}
              disabled={loading}
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Start Break
            </Button>
          ) : (
            <Button
              onClick={() => handleAction('break-end')}
              disabled={loading}
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
            >
              <Coffee className="w-4 h-4 mr-2" />
              End Break
            </Button>
          )}
          <Button
            onClick={() => handleAction('punch-out')}
            disabled={loading}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Clock className="w-4 h-4 mr-2" />
            Punch Out
          </Button>
        </>
      ) : (
        <div className="text-white">
          <p className="text-sm">Completed for today!</p>
          <p className="text-xs text-blue-100">
            {attendance.totalHours ? `Total: ${attendance.totalHours.toFixed(2)} hours` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
