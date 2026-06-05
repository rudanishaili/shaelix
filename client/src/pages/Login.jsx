import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../utils/api"
import loginBg from "../assets/login.jpg"

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
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

      const res = await API.post("/auth/login", formData)

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      setMessage("Login successful ✅")

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
        className="absolute inset-0 scale-110 bg-cover bg-center animate-[loginDrift_28s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      <div className="pointer-events-none absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-[#B388FF]/20 blur-3xl animate-[floatGlow_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[18%] bottom-[14%] h-52 w-52 rounded-full bg-[#FF5DA2]/20 blur-3xl animate-[floatGlow_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-[50%] top-[35%] h-44 w-44 rounded-full bg-[#FFD95A]/10 blur-3xl animate-[floatGlow_12s_ease-in-out_infinite]" />

      <main className="relative z-10 min-h-screen px-8 py-8 lg:px-20">
        <Link
          to="/"
          className="inline-flex rounded-full border border-white/20 bg-black/25 px-5 py-2 text-sm text-white/90 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#FFD95A]"
        >
          🪐 Shaelix Learning Orbit
        </Link>

        <section className="grid min-h-[calc(100vh-80px)] items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl overflow-hidden rounded-[2.7rem] border border-white/25 bg-black/38 p-12 shadow-2xl shadow-black/70 backdrop-blur-2xl animate-[fadeSlideUp_850ms_ease-out]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-[#B388FF]/10" />
            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#B388FF]/20 blur-3xl animate-[floatGlow_9s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#FF5DA2]/20 blur-3xl animate-[floatGlow_11s_ease-in-out_infinite]" />

            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.45em] text-[#FFD95A]">
                Access Portal
              </p>

              <h2 className="mt-4 text-6xl font-black bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                Welcome Back
              </h2>

              <p className="mt-4 text-lg text-white/75">
                Continue learning exactly where you left off.
              </p>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <label className="text-sm font-semibold text-white/90">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-3 w-full rounded-2xl border border-white/25 bg-black/45 px-6 py-5 text-lg text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#B388FF] focus:shadow-[0_0_25px_rgba(179,136,255,0.35)]"
              />

              <label className="mt-6 block text-sm font-semibold text-white/90">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="mt-3 w-full rounded-2xl border border-white/25 bg-black/45 px-6 py-5 text-lg text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all duration-300 focus:border-[#FF5DA2] focus:shadow-[0_0_25px_rgba(255,93,162,0.35)]"
              />

              <button
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-[length:200%_200%] px-6 py-5 text-lg font-black text-black shadow-lg shadow-pink-500/30 transition-all duration-500 hover:scale-[1.03] hover:bg-right disabled:opacity-60"
              >
                {loading ? "Entering Orbit..." : "Enter Shaelix"}
              </button>

              {message && (
                <p className="mt-4 text-center text-sm text-white/80">
                  {message}
                </p>
              )}

              <p className="mt-7 text-center text-sm text-white/75">
                New to Shaelix?{" "}
                <Link to="/register" className="font-bold text-[#FFD95A]">
                  Create account
                </Link>
              </p>
            </div>
          </form>

          <div className="relative animate-[fadeSlideUp_1100ms_ease-out]">
            <div className="absolute -left-10 -top-12 h-32 w-32 rounded-full bg-[#B388FF]/20 blur-3xl animate-[floatGlow_8s_ease-in-out_infinite]" />

            <p className="mb-5 inline-flex rounded-full border border-[#B388FF]/40 bg-black/25 px-5 py-2 text-sm font-semibold text-[#FFD95A] backdrop-blur-xl animate-[softFloat_5s_ease-in-out_infinite]">
              Your AI study cockpit is waiting
            </p>

            <h1 className="max-w-4xl text-6xl font-black leading-tight drop-shadow-2xl xl:text-8xl">
              Resume your{" "}
              <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                learning orbit.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-9 text-white/85">
              Jump back into saved notes, flashcards, quizzes, mind maps, and
              video-aware AI chat — all floating in your personal learning
              universe.
            </p>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
              {[
                ["📚", "Saved analyses", "Open any past video breakdown instantly."],
                ["🎯", "Quiz mode", "Practice and check answers interactively."],
                ["💬", "Video chat", "Ask questions directly from video content."],
                ["🧠", "Mind maps", "See topics as connected learning paths."],
              ].map((item, index) => (
                <div
                  key={item[1]}
                  className={`rounded-3xl border border-white/20 bg-black/25 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#B388FF]/70 ${
                    index % 2 === 0
                      ? "animate-[softFloat_6s_ease-in-out_infinite]"
                      : "animate-[softFloat_7s_ease-in-out_infinite]"
                  }`}
                >
                  <p className="text-2xl">{item[0]}</p>
                  <h3 className="mt-3 font-black">{item[1]}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {item[2]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Login