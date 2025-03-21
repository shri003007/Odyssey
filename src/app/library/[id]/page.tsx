import ClientWrapper from "./ClientWrapper";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LibraryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ClientWrapper id={resolvedParams.id} />;
}
