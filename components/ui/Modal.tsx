'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#10183f]/40 backdrop-blur-sm z-[80] data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2',
            'bg-white rounded-2xl border border-[#c8dae8] shadow-[0_24px_48px_rgba(20,40,80,0.18)] p-6',
            'focus:outline-none max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Dialog.Title className="text-lg font-bold text-[#1A1F2E]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-[#6B7280] mt-1">{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#ecf4fb] hover:text-[#374151] shrink-0">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
