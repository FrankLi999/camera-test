import { MediapipeStatusProvider } from '@/components/providers/MediapipeStatusProvider';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MediapipeStatusProvider>
      {children}
    </MediapipeStatusProvider>
  );
}