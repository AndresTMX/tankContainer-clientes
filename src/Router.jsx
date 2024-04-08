import { NextUIProvider } from "@nextui-org/react"
import { HashRouter, Routes, Route } from "react-router-dom";
import { UI } from "./UI";
//pages
import { LoginPage } from "./pages/login";
import { HomePage } from "./pages/home";
import { ProgramacionPage } from "./pages/Programacion";
import { ErrorPage } from "./pages/error";
import { RastreoPage } from "./pages/rastreeo";
import { PlantaPage } from "./pages/planta";
//context
import { ProgramacionProvider } from "./context/programacion";
import { AuthProvider } from "./context/auth";

export function Router() {

  return (
    <>
      <HashRouter>
        <NextUIProvider>
          <AuthProvider>
            <Routes>

              <Route
                path="/login"
                element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <UI>
                    <HomePage />
                  </UI>} />

              <Route
                path="/programacion"
                element={
                  <UI>
                    <ProgramacionProvider>
                      <ProgramacionPage />
                    </ProgramacionProvider>
                  </UI>} />

              <Route
                path="/planta"
                element={
                  <UI>
                    <PlantaPage />
                  </UI>} />

              <Route
                path="/rastreo"
                element={
                  <UI>
                    <RastreoPage />
                  </UI>} />

              <Route
                path="*"
                element={<ErrorPage />} />


            </Routes>
          </AuthProvider>
        </NextUIProvider>
      </HashRouter>
    </>
  )
}
