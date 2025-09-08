interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingSpinner({
  message = "Ачаалж байна",
  subMessage = "Түр хүлээнэ үү...",
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
          <p className="text-gray-600 mt-1">{subMessage}</p>
        </div>
      </div>
    </div>
  );
}
