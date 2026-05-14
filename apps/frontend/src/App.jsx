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
import Step5Shaft from "./features/design/steps/step5-shaft"
import Step6Bearings from "./features/design/steps/step6-bearings"
import Step7GearboxHousing from "./features/design/steps/step7-gearbox-housing"
import ProjectListPage from "./features/projects/project-list-page"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <DesignProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignupPage defaultLogin={true} />} />
          <Route path="/signup" element={<SignupPage defaultLogin={false} />} />
          <Route path="/design" element={<DesignProject />}>
            <Route path="step-1" element={<Step1Init />} />
            <Route path="step-2" element={<Step2Motor />} />
            <Route path="step-3" element={<Step3Belt />} />
            <Route path="step-4" element={<Step4Gearbox />} />
            <Route path="step-5" element={<Step5Shaft />} />
            <Route path="step-6" element={<Step6Bearings />} />
            <Route path="step-7" element={<Step7GearboxHousing />} />
            <Route index element={<Navigate to="step-1" replace />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DesignProvider>
      <Toaster />
    </BrowserRouter>
  );
}




export default App

