import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Analyzer from "./pages/Analyzer"
import ProtectedRoute from "./components/common/ProtectedRoute"
import History from "./pages/History"
import AnalysisDetails from "./pages/AnalysisDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/analyzer" element={<ProtectedRoute> <Analyzer /> </ProtectedRoute> } />
        <Route path="/history" element={<ProtectedRoute> <History /> </ProtectedRoute> } />
        <Route
  path="/analysis/:id"
  element={
    <ProtectedRoute>
      <AnalysisDetails />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App