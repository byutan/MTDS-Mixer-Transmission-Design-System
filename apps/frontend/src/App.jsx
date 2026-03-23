import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./features/landing/landing-page"
import SignupPage from "./features/auth/signup-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignupPage defaultLogin={true} />} />
        <Route path="/signup" element={<SignupPage defaultLogin={false} />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App

