import Link from "next/link";
import { FiBookOpen, FiFacebook, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-zinc-900 pt-16 pb-8 border-t border-slate-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 max-w-7xl ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                <FiBookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xl font-bold tracking-tight">StudyNook</span>
            </Link>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Premium study room booking platform for students and professionals seeking quiet, focused spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">Home</Link></li>
              <li><Link href="/rooms" className="text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">All Rooms</Link></li>
              <li><Link href="/about" className="text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-500 dark:text-zinc-400 text-sm">
                <FiMapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>123 Library Way, Knowledge City, ED 45678</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-zinc-400 text-sm">
                <FiPhone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-zinc-400 text-sm">
                <FiMail className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>support@studynook.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-zinc-800 text-center text-slate-500 dark:text-zinc-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StudyNook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
