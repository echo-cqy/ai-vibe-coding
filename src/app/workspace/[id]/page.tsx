import { Suspense } from 'react';
import WorkspaceClient from '@/features/workspace/components/WorkspaceClient';
import { WORKSPACE_CASES } from '@/features/workspace/data';
import { Loader2 } from 'lucide-react';

export function generateStaticParams() {
  // Pre-render known cases
  return Object.keys(WORKSPACE_CASES).map((id) => ({
    id,
  }));
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    }>
      <WorkspaceClient workspaceId={id} />
    </Suspense>
  );
}
