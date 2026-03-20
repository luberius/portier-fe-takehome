import { Route, Routes } from "react-router"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import ConflictResolverPage from "./pages/conflict-resolver"
import DetailPage from "./pages/detail"
import DiffPage from "./pages/diff"
import HistoryPage from "./pages/history"
import MainPage from "./pages/main"
import SyncPage from "./pages/sync"

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/applications/:applicationId" element={<DetailPage />} />
        <Route
          path="/applications/:applicationId/conflict-resolver"
          element={<ConflictResolverPage />}
        />
        <Route path="/applications/:applicationId/sync" element={<SyncPage />} />
        <Route path="/applications/:applicationId/history" element={<HistoryPage />} />
        <Route
          path="/applications/:applicationId/history/:historyId"
          element={<DiffPage />}
        />
      </Routes>
      <KeyboardShortcuts />
    </>
  )
}

export default App
