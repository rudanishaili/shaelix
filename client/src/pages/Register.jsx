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
        className="absolute inset-0 scale-110 bg-cover bg-center animate-[slowZoom_28s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${auroraBg})` }}
      />

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-[#02110D]/25 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div className="pointer-events-none absolute left-16 top-20 h-32 w-32 rounded-full bg-white/10 blur-3xl animate-[floatGlow_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-28 bottom-20 h-40 w-40 rounded-full bg-[#FFD95A]/20 blur-3xl animate-[floatGlow_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-36 w-36 rounded-full bg-[#FF5DA2]/15 blur-3xl animate-[floatGlow_12s_ease-in-out_infinite]" />

      <main className="relative z-10 grid min-h-screen items-center gap-14 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:px-20">
        <section className="animate-[fadeSlideUp_900ms_ease-out]">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.10] px-4 py-2 text-sm text-white/90 shadow-lg shadow-black/20 backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-[#B388FF]/70 hover:bg-white/[0.16]"
          >
            ✨ Shaelix — Learn without losing focus
          </Link>

          <h1 className="mt-8 max-w-3xl text-5xl font-black leading-tight drop-shadow-2xl md:text-7xl">
            Turn videos into{" "}
            <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent animate-[gradientText_6s_ease-in-out_infinite]">
              structured learning.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 drop-shadow-lg">
            Shaelix converts educational YouTube videos into smart notes,
            clickable timestamps, flashcards, quizzes, mind maps, and video-aware
            chat — all inside one focused AI learning workspace.
          </p>

          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="group rounded-3xl border border-white/20 bg-white/[0.09] p-6 shadow-xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#B388FF]/70 hover:bg-white/[0.14]">
              <p className="text-3xl transition-transform duration-500 group-hover:scale-125">
                🎥
              </p>
              <h3 className="mt-4 text-lg font-bold">Video Intelligence</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Extract meaningful notes from long videos without manually
                typing while watching.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/20 bg-white/[0.09] p-6 shadow-xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#FF5DA2]/70 hover:bg-white/[0.14]">
              <p className="text-3xl transition-transform duration-500 group-hover:scale-125">
                🧠
              </p>
              <h3 className="mt-4 text-lg font-bold">Active Revision</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Practice with AI flashcards, quizzes, mind maps, and chat with
                the video content.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/85">
            {["Timestamped notes", "Chat with video", "Export PDF"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/[0.10] px-4 py-2 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD95A]/70 hover:bg-white/[0.16]"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl animate-[fadeSlideUp_1100ms_ease-out]">
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/[0.12] p-10 shadow-2xl shadow-black/60 backdrop-blur-3xl transition-all duration-500 hover:border-white/40 hover:bg-white/[0.15]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-white/5" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#FF5DA2]/20 blur-3xl animate-[floatGlow_9s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#B388FF]/20 blur-3xl animate-[floatGlow_11s_ease-in-out_infinite]" />

            <div className="relative">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FFD95A]">
                  Start free
                </p>

                <h2 className="mt-3 text-5xl font-black bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                  Create Account
                </h2>

                <p className="mt-3 text-white/70">
                  Build your personal AI learning library.
                </p>
              </div>

              <label className="text-sm text-white/85">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#B388FF] focus:bg-black/45 focus:shadow-lg focus:shadow-[#B388FF]/20"
              />

              <label className="mt-5 block text-sm text-white/85">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#FF5DA2] focus:bg-black/45 focus:shadow-lg focus:shadow-[#FF5DA2]/20"
              />

              <label className="mt-5 block text-sm text-white/85">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#FFD95A] focus:bg-black/45 focus:shadow-lg focus:shadow-[#FFD95A]/20"
              />

              <button
                disabled={loading}
                className="mt-7 w-full rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-[length:200%_200%] px-5 py-4 font-black text-black shadow-lg shadow-pink-500/30 transition-all duration-500 hover:scale-[1.03] hover:bg-right disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Shaelix Account"}
              </button>

              {message && (
                <p className="mt-4 text-center text-sm text-white/80">
                  {message}
                </p>
              )}

              <p className="mt-6 text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[#FFD95A]">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Register