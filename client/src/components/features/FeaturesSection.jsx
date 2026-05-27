import FeatureCard from "../ui/FeatureCard"

function FeaturesSection() {
  const features = [
    {
      icon: "🎯",
      title: "Focus-first notes",
      description:
        "Shaelix captures only the important points so you can stay focused on the video instead of typing everything.",
    },
    {
      icon: "⏱️",
      title: "Timestamped learning",
      description:
        "Every concept is connected to the exact video moment, making revision faster and more meaningful.",
    },
    {
      icon: "🧠",
      title: "Concept detection",
      description:
        "Important definitions, examples, warnings, and interview-worthy points are separated automatically.",
    },
    {
      icon: "⚡",
      title: "Revision mode",
      description:
        "Turn video notes into quick revision bullets, flashcards, and practice questions.",
    },
    {
      icon: "🧩",
      title: "Topic structure",
      description:
        "Long videos are broken into clean topic sections so learning feels organized, not overwhelming.",
    },
    {
      icon: "🚀",
      title: "Learning history",
      description:
        "Save videos, notes, flashcards, and key concepts in one personal learning dashboard.",
    },
  ]

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#B388FF]">
            Built for deep learning
          </p>

          <h2 className="text-4xl font-extrabold text-white md:text-6xl">
            Not just notes.{" "}
            <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
              Structured knowledge.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400">
            Shaelix turns educational videos into clean, searchable, revision-ready learning material.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection