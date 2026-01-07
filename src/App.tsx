import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Docs from "./pages/Docs";
import DevMode from "./pages/DevMode";
import GettingStarted from "./pages/docs/GettingStarted";
import Applications from "./pages/docs/Applications";
import Facility from "./pages/docs/Facility";
import TerminalGuide from "./pages/docs/TerminalGuide";
import AdminPanelDocs from "./pages/docs/AdminPanel";
import Advanced from "./pages/docs/Advanced";
import Shortcuts from "./pages/docs/Shortcuts";
import Troubleshooting from "./pages/docs/Troubleshooting";
import DefDevDocs from "./pages/docs/DefDev";
import DefDevIndex from "./pages/docs/defdev/Index";
import DefDevSetup from "./pages/docs/defdev/Setup";
import DefDevConsole from "./pages/docs/defdev/Console";
import DefDevActions from "./pages/docs/defdev/Actions";
import DefDevStorage from "./pages/docs/defdev/Storage";
import DefDevTerminal from "./pages/docs/defdev/Terminal";
import DefDevAdmin from "./pages/docs/defdev/Admin";
import DefDevBugchecks from "./pages/docs/defdev/Bugchecks";
import DefDevAPI from "./pages/docs/defdev/API";
import DefDevDiagnostics from "./pages/docs/defdev/Diagnostics";
import UURDocs from "./pages/docs/UUR";
import Features from "./pages/docs/Features";
import Safety from "./pages/docs/Safety";
import Moderation from "./pages/docs/Moderation";

// Safety sub-pages
import Badges from "./pages/docs/safety/Badges";
import AccountSafety from "./pages/docs/safety/AccountSafety";
import Reporting from "./pages/docs/safety/Reporting";

// Moderation sub-pages
import ModerationOverview from "./pages/docs/moderation/Overview";
import NaviMonitor from "./pages/docs/moderation/NaviMonitor";
import ModerationActions from "./pages/docs/moderation/Actions";
import Statistics from "./pages/docs/moderation/Statistics";

import NotFound from "./pages/NotFound";
import ModerationPanel from "./pages/ModerationPanel";
import StatusPage from "./pages/Status";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Team from "./pages/Team";
import TeamGit from "./pages/TeamGit";
import Support from "./pages/Support";

// Account Manager pages
import AccManageLayout from "./pages/acc-manage/Layout";
import AccManageGeneral from "./pages/acc-manage/General";
import AccManageData from "./pages/acc-manage/Data";
import AccManageSecurity from "./pages/acc-manage/Security";
import AccManageDevices from "./pages/acc-manage/Devices";
import AccManageDanger from "./pages/acc-manage/Danger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/def-dev" element={<DevMode />} />
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/applications" element={<Applications />} />
        <Route path="/docs/facility" element={<Facility />} />
        <Route path="/docs/terminal" element={<TerminalGuide />} />
        <Route path="/docs/admin-panel" element={<AdminPanelDocs />} />
        <Route path="/docs/advanced" element={<Advanced />} />
        <Route path="/docs/shortcuts" element={<Shortcuts />} />
        <Route path="/docs/troubleshooting" element={<Troubleshooting />} />
        <Route path="/docs/def-dev" element={<DefDevIndex />} />
        <Route path="/docs/def-dev/setup" element={<DefDevSetup />} />
        <Route path="/docs/def-dev/console" element={<DefDevConsole />} />
        <Route path="/docs/def-dev/actions" element={<DefDevActions />} />
        <Route path="/docs/def-dev/storage" element={<DefDevStorage />} />
        <Route path="/docs/def-dev/terminal" element={<DefDevTerminal />} />
        <Route path="/docs/def-dev/admin" element={<DefDevAdmin />} />
        <Route path="/docs/def-dev/bugchecks" element={<DefDevBugchecks />} />
        <Route path="/docs/def-dev/api" element={<DefDevAPI />} />
        <Route path="/docs/def-dev/diagnostics" element={<DefDevDiagnostics />} />
        <Route path="/docs/uur" element={<UURDocs />} />
        <Route path="/docs/features" element={<Features />} />
        
        {/* Safety docs - hub and sub-pages */}
        <Route path="/docs/safety" element={<Safety />} />
        <Route path="/docs/safety/badges" element={<Badges />} />
        <Route path="/docs/safety/account" element={<AccountSafety />} />
        <Route path="/docs/safety/reporting" element={<Reporting />} />
        
        {/* Moderation docs - hub and sub-pages */}
        <Route path="/docs/moderation" element={<Moderation />} />
        <Route path="/docs/moderation/overview" element={<ModerationOverview />} />
        <Route path="/docs/moderation/navi" element={<NaviMonitor />} />
        <Route path="/docs/moderation/actions" element={<ModerationActions />} />
        <Route path="/docs/moderation/stats" element={<Statistics />} />
        
        {/* Account Manager - nested routes */}
        <Route path="/acc-manage" element={<AccManageLayout />}>
          <Route index element={<Navigate to="/acc-manage/general" replace />} />
          <Route path="general" element={<AccManageGeneral />} />
          <Route path="data" element={<AccManageData />} />
          <Route path="security" element={<AccManageSecurity />} />
          <Route path="devices" element={<AccManageDevices />} />
          <Route path="danger" element={<AccManageDanger />} />
        </Route>
        
        {/* Moderation Panel - Admin only */}
        <Route path="/moderation" element={<ModerationPanel />} />
        
        {/* Status Page */}
        <Route path="/status" element={<StatusPage />} />
        
        {/* Legal Pages */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/git" element={<TeamGit />} />
        <Route path="/support" element={<Support />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
