'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useChat } from '@/features/chat/hooks/useChat';
import { WORKSPACE_CASES } from '@/features/workspace/data';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ChatBox = dynamic(() => import('@/features/chat/components/ChatBox'), {
  loading: () => <LoadingSkeleton />,
  ssr: true // ChatBox is lightweight and benefits from SEO/SSR
});

const EditorPane = dynamic(() => import('@/features/editor/components/EditorPane').then(mod => mod.EditorPane), {
  loading: () => <LoadingSkeleton />,
  ssr: false // Monaco Editor is heavy and client-only, disable SSR to reduce HTML size and hydration cost
});

const LoadingSkeleton = () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="animate-spin" size={24} />
    </div>
);

interface Props {
  workspaceId: string;
}

export default function WorkspaceClient({ workspaceId }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sendMessage, messages, resetSession, sessionId } = useChat();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Avoid double initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const caseData = WORKSPACE_CASES[workspaceId];
    const promptParam = searchParams.get('prompt');

    // Scenario 1: Case Workspace (e.g. /workspace/ecommerce)
    if (caseData) {
      // If we are already in this session (simple check), don't reset
      // For now, we always reset for a "fresh" case start unless we track case-session mapping
      resetSession(); 
      setTimeout(() => {
        sendMessage(caseData.initialPrompt);
      }, 100);
    } 
    // Scenario 2: New Workspace with Prompt (e.g. /workspace/new?prompt=...)
    else if (workspaceId === 'new') {
      resetSession();
      if (promptParam) {
        setTimeout(() => {
          sendMessage(promptParam);
        }, 100);
      }
    }
    // Scenario 3: Existing Session (e.g. /workspace/uuid)
    // Here we would ideally check if workspaceId matches current sessionId
    // If not, we might want to load it. 
    // For now, we assume if it's not "new" and not a case, it might be a session ID.
    // Since we rely on localStorage persistence, we just let it be if it matches.
    else if (workspaceId !== sessionId && workspaceId !== 'new') {
        // In a real app, we would loadSession(workspaceId) here
        // For this demo, we'll just let the persisted state load, 
        // or if we wanted to support multiple sessions, we'd switch context.
        // Let's assume for now the user is continuing their last session if they go to /workspace/current
    }

  }, [workspaceId, searchParams, sendMessage, resetSession, sessionId]);

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={20} className="border-r border-gray-200">
          <div className="h-full w-full">
            <ChatBox />
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-100 hover:bg-blue-500 transition-colors cursor-col-resize" />
        <Panel defaultSize={70} minSize={30}>
           <EditorPane />
        </Panel>
      </PanelGroup>
    </div>
  );
}
