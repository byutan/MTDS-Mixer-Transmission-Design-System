import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./features/landing/landing-page"
import SignupPage from "./features/auth/signup-page"
import NotFound from "./features/common/not-found"
import DesignProject from "./features/design/design-project"
import ProfilePage from "./features/profile/profile-page"
import { DesignProvider } from "@/features/design/context/DesignContext"
import Step1Init from "./features/design/steps/step1-init"
import Step2Motor from "./features/design/steps/step2-motor"
import Step3Belt from "./features/design/steps/step3-belt"
import Step4Gearbox from "./features/design/steps/step4-gearbox"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignupPage defaultLogin={true} />} />
        <Route path="/signup" element={<SignupPage defaultLogin={false} />} />
        <Route path="/design" element={
          <DesignProvider>
            <DesignProject />
          </DesignProvider>
        }>
          <Route path="step-1" element={<Step1Init />} />
          <Route path="step-2" element={<Step2Motor />} />
          <Route path="step-3" element={<Step3Belt />} />
          <Route path="step-4" element={<Step4Gearbox />} />
          <Route path="step-5" element={
             <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <span className="text-4xl font-black text-slate-200">5</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 font-sans tracking-tight">Trục & Ổ lăn</h3>
                <p className="text-slate-500 font-medium italic">Tính năng này đang được phát triển...</p>
            </div>
          } />
          <Route index element={<Navigate to="step-1" replace />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}




export default App

