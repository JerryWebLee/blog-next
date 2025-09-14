export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 blog-border-y-box-shadowlue-200 blog-border-x-box-shadow-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
