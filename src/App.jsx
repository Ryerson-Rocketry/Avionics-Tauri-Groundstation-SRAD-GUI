import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Note: Tauri v2 uses @tauri-apps/api/core
import MainMenu from "./main-menu/MainMenu.jsx";
import TelemetryDashboardPage from "./telemetry-dashboard/TelemetryDashboardPage.jsx";
import ReplayDashboardPage from "./telemetry-dashboard/ReplayDashboardPage.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { ThemeProvider } from "./styles/ThemeContext.jsx";
import "./App.css";

function App() {
  const [appConfig, setAppConfig] = useState(null);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("main"); // 'main' | 'telemetry' | 'replay'
  const [activeMission, setActiveMission] = useState(null);
  const [activeReplaySave, setActiveReplaySave] = useState(null);

  const refreshAppConfig = async () => {
    try {
      const data = await invoke("initialize_app");
      setAppConfig(data);
    } catch (err) {
      console.error("Failed to refresh app config:", err);
    }
  };

  const deleteSave = async (saveDirName) => {
    try {
      await invoke("delete_mission_save", { saveDirName });
      await refreshAppConfig();
    } catch (err) {
      console.error("Failed to delete save:", err);
      window.alert("Failed to delete save: " + (err?.message || String(err)));
    }
  };

  useEffect(() => {
    const onError = (event) => {
      console.error("[RocketView] Unhandled error:", event.error ?? event.message, event.filename, event.lineno);
    };
    const onRejection = (event) => {
      console.error("[RocketView] Unhandled promise rejection:", event.reason);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  useEffect(() => {
    // Call the Rust function we created
    invoke("initialize_app")
      .then((data) => {
        console.log("Filesystem initialized:", data);
        setAppConfig(data);
      })
      .catch((err) => {
        console.error("Failed to initialize:", err);
        setError(err);
      });
  }, []);

  if (error) {
    const msg = error?.message || String(error);
    return <div style={{ color: "white" }}>Error loading app: {msg}</div>;
  }
  if (!appConfig) return <div style={{ color: "white" }}>Initializing Rocket Sim...</div>;

  const initialTheme = appConfig?.settings?.theme;

  // Dedicated full-screen telemetry dashboard view without main-menu chrome.
  let content = null;

  if (activeView === "telemetry" && activeMission) {
    content = (
      <div className="app-root">
        <ErrorBoundary
          onReset={async () => {
            setActiveMission(null);
            setActiveView("main");
            await refreshAppConfig();
          }}
        >
          <TelemetryDashboardPage
            mission={activeMission}
            onExit={async () => {
              setActiveMission(null);
              setActiveView("main");
              await refreshAppConfig();
            }}
          />
        </ErrorBoundary>
      </div>
    );
  } else if (activeView === "replay" && activeReplaySave) {
    content = (
      <div className="app-root">
        <ErrorBoundary
          onReset={async () => {
            setActiveReplaySave(null);
            setActiveView("main");
            await refreshAppConfig();
          }}
        >
          <ReplayDashboardPage
            saveDirName={activeReplaySave}
            onExit={async () => {
              setActiveReplaySave(null);
              setActiveView("main");
              await refreshAppConfig();
            }}
          />
        </ErrorBoundary>
      </div>
    );
  } else {
    content = (
      <div className="app-root">
        {/* Pass the saves and settings to your MainMenu */}
        <MainMenu
          saves={appConfig.available_saves}
          settings={appConfig.settings}
          onMissionLinkReady={(mission) => {
            setActiveMission(mission);
            setActiveView("telemetry");
          }}
          onReplaySave={(saveDirName) => {
            setActiveReplaySave(saveDirName);
            setActiveView("replay");
          }}
          onDeleteSave={deleteSave}
        />
      </div>
    );
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      {content}
    </ThemeProvider>
  );
}
export default App;