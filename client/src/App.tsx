import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useRef } from "react";
// import animationData from "./animations/app-loading.json";
// import LottieAnimation from "./components/utils/LottieAnimation";
import ErrorBoundary from "./pages/ErrorBoundary";
import type { lazyComponent, SpanRef } from "./utils/AppTypes";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VideoCallView from "./components/VideoCallView";
import Loading from "./components/Loading";

const HomePage: lazyComponent = lazy(() => import("./pages/HomePage"));
const ChatsPage: lazyComponent = lazy(() => import("./pages/ChatsPage"));
const AppToast: lazyComponent = lazy(
  () => import("./components/utils/AppToast")
);

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense
          fallback={
            <div style={{ marginTop: 150 }}>
              <Loading/>
            </div>
          }
        >
          {/* App routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/chats" element={<ChatsPage />} />
          </Routes>

          {/* Toast */}
          <AppToast />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
