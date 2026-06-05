import { useNavigate } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import homeBg from "../assets/8.jpg"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070A] text-white">
      <div
        className="fixed inset-0 scale-110 bg-cover bg-center opacity-45 animate-[homeDrift_35s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${homeBg})` }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#05070A]/75 to-black" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(179,136,255,0.22),transparent_30%),radial-gradient(circle_at_85%_40%,rgba(255,93,162,0.16),transparent_28%),radial-gradient(circle_at_25%_70%,rgba(255,217,90,0.10),transparent_25%)]" />

      <div className="relative z-10">
        <Navbar />

        <section className="px-6 pt-28 text-center lg:px-20">
          <div className="group relative mx-auto inline-flex overflow-hidden rounded-full border border-[#B388FF]/30 bg-black/40 px-8 py-4 text-center text-sm font-semibold text-white shadow-2xl shadow-black/40 backdrop-blur-2xl">
  
  <div className="absolute inset-0 bg-gradient-to-r from-[#B388FF]/10 via-[#FF5DA2]/10 to-[#FFD95A]/10 opacity-80" />

  <div className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/20 blur-xl animate-[shine_4s_linear_infinite]" />

  <div className="absolute inset-0 rounded-full border border-white/10" />

  <span className="relative z-10 flex items-center gap-3 tracking-wide">
    <span className="animate-pulse text-lg">✨</span>

    <span className="bg-gradient-to-r from-white via-[#FFD95A] to-white bg-clip-text text-transparent">
      Every background represents a different learning state.
    </span>
  </span>
</div>

          <h1 className="mx-auto mt-10 max-w-5xl text-6xl font-black leading-[1.05] tracking-[-0.04em] md:text-8xl">
  Learn faster.
  <br />
  <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
    Remember longer.
  </span>
</h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/70">
            Shaelix transforms long educational videos into notes, timestamps,
            flashcards, quizzes, mind maps, and video-aware chat — so learning
            becomes structured, searchable, and revision-ready.
          </p>

          <div className="mt-10 flex justify-center gap-5">
            <button
              onClick={() => navigate("/register")}
              className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-8 py-4 font-black text-black shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
            >
              Start Free →
            </button>

            <button
              onClick={() => navigate("/login")}
              className="rounded-2xl border border-white/15 bg-white/[0.05] px-8 py-4 font-bold text-white backdrop-blur-xl transition-all hover:scale-105 hover:border-[#B388FF]"
            >
              Login
            </button>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-20">
          <div className="mx-auto max-w-6xl rounded-[3rem] border border-white/15 bg-black/35 p-8 shadow-2xl shadow-black/70 backdrop-blur-2xl">
            <p className="text-center text-sm font-bold uppercase tracking-[0.4em] text-[#FFD95A]">
              How Shaelix Works
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-5">
              {[
                ["🎥", "Paste Video", "Drop a YouTube learning video."],
                ["🧠", "AI Reads", "Transcript is analyzed deeply."],
                ["📝", "Notes", "Clean structured notes appear."],
                ["🎯", "Practice", "Flashcards and quizzes are generated."],
                ["🗺️", "Map", "Mind map connects the whole topic."],
              ].map((step, index) => (
                <div
                  key={step[1]}
                  className="relative rounded-3xl border border-white/15 bg-white/[0.05] p-6 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-[#FF5DA2]/70"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/35 text-3xl">
                    {step[0]}
                  </div>

                  <h3 className="mt-5 font-black">{step[1]}</h3>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {step[2]}
                  </p>

                  <span className="absolute right-5 top-5 text-sm text-[#FFD95A]">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-10 lg:px-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[3rem] border border-white/15 bg-white/[0.05] p-10 backdrop-blur-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFD95A]">
                Not a summarizer
              </p>

              <h2 className="mt-5 text-5xl font-black leading-tight">
                It behaves like a learning cockpit.
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/65">
                Instead of dumping a basic summary, Shaelix creates different
                learning layers: quick notes, revision cards, questions,
                timestamps, mind maps, and contextual chat.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Clickable timestamps", "Jump to exact video moments instantly."],
                ["Interactive flashcards", "Reveal answers while revising."],
                ["Quiz mode", "Test your understanding after watching."],
                ["Chat with video", "Ask questions from the actual transcript."],
                ["Mind maps", "See the topic visually as branches."],
                ["PDF export", "Save notes for offline revision."],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="rounded-3xl border border-white/15 bg-black/30 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#B388FF]/70"
                >
                  <h3 className="font-black text-white">{item[0]}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {item[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFD95A]">
              Built for focused learners
            </p>

            <h2 className="mt-5 text-5xl font-black md:text-6xl">
              Stop saving videos you never finish.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
              Turn scattered YouTube learning into a personal knowledge system
              that helps you revise, practice, and actually remember.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-9 rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-9 py-4 font-black text-black transition-all hover:scale-105"
            >
              Build My Study System
            </button>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black/40 px-6 py-8 backdrop-blur-xl lg:px-20">
          <div className="flex flex-col justify-between gap-4 text-sm text-white/60 md:flex-row">
            <p>© 2026 Shaelix. Learn without losing focus.</p>
            <p>AI Notes • Quiz • Mind Maps • Flashcards • Video Chat</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home