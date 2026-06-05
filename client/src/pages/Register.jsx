import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../utils/api"
import auroraBg from "../assets/aurora.jpg"

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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url(${auroraBg})` }}
      />

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/45" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <main className="relative z-10 grid min-h-screen items-center gap-16 px-8 py-10 lg:grid-cols-[1fr_1fr] lg:px-20">
        <section className="max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-white/25 bg-black/25 px-5 py-2 text-sm text-white/90 shadow-lg shadow-black/30 backdrop-blur-xl transition-all hover:border-[#FFD95A]/70"
          >
            ✨ Shaelix — Learn without losing focus
          </Link>

          <h1 className="mt-10 text-6xl font-black leading-tight drop-shadow-2xl xl:text-7xl">
            Turn videos into{" "}
            <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
              structured learning.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/90 drop-shadow-lg">
            Shaelix converts educational YouTube videos into smart notes,
            clickable timestamps, flashcards, quizzes, mind maps, and
            video-aware chat — all inside one focused AI learning workspace.
          </p>

          <div className="mt-9 flex flex-wrap gap-6">
            <div className="w-[310px] rounded-3xl border border-white/20 bg-black/25 p-7 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#B388FF]/70">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B388FF]/20 text-2xl">
                🤖
              </div>

              <h3 className="text-xl font-black">Video Intelligence</h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Extract meaningful notes from long videos without manually
                typing while watching.
              </p>
            </div>

            <div className="w-[310px] rounded-3xl border border-white/20 bg-black/25 p-7 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5DA2]/70">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5DA2]/20 text-2xl">
                🧠
              </div>

              <h3 className="text-xl font-black">Active Revision</h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Practice with AI flashcards, quizzes, mind maps, and chat with
                the video content.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-white/90">
            <span className="rounded-2xl border border-white/20 bg-black/25 px-6 py-3 backdrop-blur-xl">
              ◷ Timestamped notes
            </span>

            <span className="rounded-2xl border border-white/20 bg-black/25 px-6 py-3 backdrop-blur-xl">
              💬 Chat with video
            </span>

            <span className="rounded-2xl border border-white/20 bg-black/25 px-6 py-3 backdrop-blur-xl">
              📄 Export PDF
            </span>
          </div>

          <div className="mt-10 grid max-w-2xl gap-5 sm:grid-cols-3">
            <div className="flex items-center gap-3 text-sm text-white/85">
              <span className="text-2xl text-green-300">🛡</span>
              <p>
                <b>Trusted</b>
                <br />
                by learners
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <span className="text-2xl text-[#FFD95A]">⚡</span>
              <p>
                <b>Save hours</b>
                <br />
                of study time
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <span className="text-2xl text-[#FFD95A]">🔒</span>
              <p>
                <b>Your data</b>
                <br />
                stays safe
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/25 bg-black/40 p-12 shadow-2xl shadow-black/70 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-transparent to-[#FFD95A]/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-[#B388FF]/40 shadow-[0_0_45px_rgba(179,136,255,0.22),0_0_55px_rgba(255,217,90,0.16)]" />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-[#FFD95A]">
                Start free
              </p>

              <h2 className="mt-4 text-5xl font-black bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                Create Account
              </h2>

              <p className="mt-4 text-lg text-white/80">
                Build your personal AI learning library.
              </p>

              <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <label className="text-sm font-semibold text-white/90">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="mt-3 w-full rounded-2xl border border-white/25 bg-black/35 px-6 py-5 text-lg text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all focus:border-[#B388FF] focus:shadow-[0_0_25px_rgba(179,136,255,0.35)]"
              />

              <label className="mt-6 block text-sm font-semibold text-white/90">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-3 w-full rounded-2xl border border-white/25 bg-black/35 px-6 py-5 text-lg text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all focus:border-[#FF5DA2] focus:shadow-[0_0_25px_rgba(255,93,162,0.35)]"
              />

              <label className="mt-6 block text-sm font-semibold text-white/90">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="mt-3 w-full rounded-2xl border border-white/25 bg-black/35 px-6 py-5 text-lg text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all focus:border-[#FFD95A] focus:shadow-[0_0_25px_rgba(255,217,90,0.35)]"
              />

              <button
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-6 py-5 text-lg font-black text-black shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Shaelix Account"}
                <span>→</span>
              </button>

              {message && (
                <p className="mt-4 text-center text-sm text-white/80">
                  {message}
                </p>
              )}

              <p className="mt-7 text-center text-sm text-white/75">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-[#FFD95A]">
                  Login
                </Link>
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/20" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Secure AI workspace
                </p>
                <div className="h-px flex-1 bg-white/20" />
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Register