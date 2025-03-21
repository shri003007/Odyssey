"use client";

import LibraryDetailClient from "./LibraryDetailClient";

export default function ClientWrapper({ id }: { id: string }) {
  return <LibraryDetailClient params={{ id }} />;
} 