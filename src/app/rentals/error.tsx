"use client";

import RouteError from "@/components/RouteError";

export default function Error({ retry }: { retry: () => void }) {
  return <RouteError retry={retry} />;
}
