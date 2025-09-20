export default function BlogManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-50">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
