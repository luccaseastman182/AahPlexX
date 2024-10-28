import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 mb-4 flex items-center',
        type === 'success' 
          ? 'bg-success/10 text-success' 
          : 'bg-error/10 text-error'
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 mr-2" />
      ) : (
        <AlertCircle className="h-5 w-5 mr-2" />
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
}