export function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-4 pb-20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium text-foreground mb-2">Loading reservations...</div>
        <div className="text-muted-foreground">Please wait while we fetch the data</div>
      </div>
    </div>
  );
}