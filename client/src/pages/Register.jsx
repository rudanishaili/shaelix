import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../utils/api"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      setLoading(true)

      const res = await API.post("/auth/register", formData)

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      setMessage("Registration successful ✅")

      setTimeout(() => {
        navigate("/dashboard")
      }, 700)
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02110D] text-white">
      <div className="aurora-layer">
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="aurora aurora-three" />
        <div className="aurora aurora-four" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_center,transparent_0%,rgba(2,17,13,0.10)_40%,rgba(2,17,13,0.82)_100%)]" />

      <main className="relative z-10 grid min-h-screen items-center gap-14 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:px-20">
        <section>
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-gray-300 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-[#B388FF]/60"
          >
            ✨ Shaelix — Learn without losing focus
          </Link>

          <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight md:text-7xl">
            Turn videos into{" "}
            <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
              structured learning.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Shaelix converts educational YouTube videos into smart notes,
            clickable timestamps, flashcards, quizzes, mind maps, and video-aware
            chat — all inside one focused AI learning workspace.
          </p>

          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="group rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#B388FF]/60">
              <p className="text-3xl">🎥</p>
              <h3 className="mt-4 text-lg font-bold">Video Intelligence</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Extract meaningful notes from long videos without manually
                typing while watching.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5DA2]/60">
              <p className="text-3xl">🧠</p>
              <h3 className="mt-4 text-lg font-bold">Active Revision</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Practice with AI flashcards, quizzes, mind maps, and chat with
                the video content.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-300">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-xl">
              Timestamped notes
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-xl">
              Chat with video
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-xl">
              Export PDF
            </span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2.5rem] border border-white/10 bg-[#071712]/75 p-10 shadow-2xl shadow-black/60 backdrop-blur-2xl"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FFD95A]">
                Start free
              </p>

              <h2 className="mt-3 text-5xl font-black bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                Create Account
              </h2>

              <p className="mt-3 text-gray-400">
                Build your personal AI learning library.
              </p>
            </div>

            <label className="text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#03110D]/70 px-5 py-4 outline-none transition-all focus:border-[#B388FF] focus:bg-black/30"
            />

            <label className="mt-5 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#03110D]/70 px-5 py-4 outline-none transition-all focus:border-[#FF5DA2] focus:bg-black/30"
            />

            <label className="mt-5 block text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#03110D]/70 px-5 py-4 outline-none transition-all focus:border-[#FFD95A] focus:bg-black/30"
            />

            <button
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-5 py-4 font-black text-black shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Shaelix Account"}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-gray-300">
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#FFD95A]">
                Login
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Register