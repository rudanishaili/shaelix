import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 border-b border-white/10">

      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
        Shaelix
      </h1>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="px-5 py-2 rounded-xl border border-white/10 hover:border-[#B388FF] transition-all duration-300 text-white"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] text-black font-semibold hover:scale-105 transition-all duration-300"
        >
          Get Started
        </Link>

      </div>
    </nav>
  )
}

export default Navbar