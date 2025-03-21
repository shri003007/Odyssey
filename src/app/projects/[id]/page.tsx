// Server component - no 'use client' directive needed here
import ProjectDetailClient from './ProjectDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProjectDetailClient id={resolvedParams.id} />;
} 