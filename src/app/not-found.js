import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";;

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-zinc-900/20">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
          <FiAlertCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">404</h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Page not found</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 mt-8">
          <Link 
            href="/" 
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
