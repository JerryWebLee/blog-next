import Loading from "@/components/ui/loading";

export default function BlogLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loading variant="skeleton" text="博客内容加载中..." size="lg" />
    </div>
  );
}
