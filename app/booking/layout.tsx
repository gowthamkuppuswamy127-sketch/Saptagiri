import { Suspense } from 'react';
import { BookingProvider } from '@/lib/booking/context';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { HoldTimer } from '@/components/booking/HoldTimer';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <Suspense fallback={<div className="h-14 border-b border-line" />}>
        <BookingStepper />
      </Suspense>
      <HoldTimer />
      <Suspense fallback={<BookingSkeleton />}>{children}</Suspense>
    </BookingProvider>
  );
}

function BookingSkeleton() {
  return (
    <div className="container-page py-12">
      <div className="h-8 w-56 animate-pulse rounded-sm bg-surface-2" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-md bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
