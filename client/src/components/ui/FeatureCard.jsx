function FeatureCard({ title, description, icon }) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#B388FF]/60 hover:bg-white/[0.07]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#B388FF]/10 via-[#FF5DA2]/10 to-[#FFD95A]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] text-2xl">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-white">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          {description}
        </p>
      </div>
    </div>
  )
}

export default FeatureCard