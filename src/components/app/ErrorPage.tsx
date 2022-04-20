export const ErrorPage: React.FC<{ error: string }> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="-mt-5">
        <span className="font-bold text-red-500">ERROR</span>
        <span className="mx-3 text-zinc-300">|</span>
        {error}
      </div>
    </div>
  )
}
