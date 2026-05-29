import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await API.post("/auth/register", formData)

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      setMessage("Registration successful ✅")

      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)

    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
          Create Account
        </h1>

        <p className="mt-3 text-gray-400">
          Start learning without losing focus.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="mt-8 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#B388FF]"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#B388FF]"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#B388FF]"
        />

        <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-5 py-3 font-bold text-black">
          Register
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export default Register