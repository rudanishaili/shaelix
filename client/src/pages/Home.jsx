import Navbar from "../components/common/Navbar"
import FeaturesSection from "../components/features/FeaturesSection"

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0F0F14] text-white">
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#B388FF]/20 blur-[120px]" />
      <div className="absolute right-10 top-96 h-72 w-72 rounded-full bg-[#FF5DA2]/20 blur-[120px]" />
      <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-[#FFD95A]/10 blur-[120px]" />

      <div className="relative z-10">
        <Navbar />

        <section className="flex flex-col items-center justify-center px-6 pt-32 text-center">
          <h1 className="text-6xl font-extrabold leading-tight md:text-8xl">
            Learn without <br />
            <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
              losing focus.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-400">
            Shaelix transforms educational videos into structured notes,
            flashcards, timestamps, and revision-ready knowledge.
          </p>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row">
            <button className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-8 py-4 font-bold text-black shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-105">
              Start Learning
            </button>

            <button className="rounded-2xl border border-white/10 px-8 py-4 transition-all duration-300 hover:border-[#B388FF]">
              Watch Demo
            </button>
          </div>
        </section>

        <FeaturesSection />
      </div>
    </div>
  )
}

export default Home