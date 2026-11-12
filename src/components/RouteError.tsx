"use client";

import StateMessage from "@/components/StateMessage";

// Shared body for error.tsx files: Snappy tripped, offer a retry.
export default function RouteError({ retry }: { retry: () => void }) {
  return (
    <main className="px-6 py-14">
      <StateMessage
        pose="confused"
        title="Oops, Snappy tripped!"
        actions={
          <button type="button" onClick={() => retry()} className="btn btn-primary">
            Try again
          </button>
        }
      >
        Something went wrong on our side. Try again?
      </StateMessage>
    </main>
  );
}
