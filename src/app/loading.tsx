export default function Loading() {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-gray-500 animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }
