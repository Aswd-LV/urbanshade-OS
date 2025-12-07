import { useState, useEffect } from "react";
import { Package, Download, Star, CheckCircle, Trash2, RefreshCw, ExternalLink, Send, Github, AlertCircle, Search } from "lucide-react";
import { 
  UUR_REAL_PACKAGES, 
  getUURAppHtml, 
  getInstalledUURApps, 
  installUURApp, 
  uninstallUURApp,
  isUURAppInstalled,
  addSubmission,
  getSubmissions,
  type InstalledUURApp 
} from "@/lib/uurRepository";
import { toast } from "sonner";

interface UURAppProps {
  onClose: () => void;
}

type Tab = 'browse' | 'installed' | 'submit' | 'run';

export const UURApp = ({ onClose }: UURAppProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [installedApps, setInstalledApps] = useState<InstalledUURApp[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);
  const [runningApp, setRunningApp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Submit form
  const [submitForm, setSubmitForm] = useState({
    packageName: '',
    githubUrl: '',
    author: '',
    description: ''
  });

  useEffect(() => {
    setInstalledApps(getInstalledUURApps());
  }, []);

  const handleInstall = async (appId: string) => {
    setInstalling(appId);
    await new Promise(r => setTimeout(r, 1500)); // Simulate install
    
    if (installUURApp(appId)) {
      setInstalledApps(getInstalledUURApps());
      toast.success(`Installed ${UUR_REAL_PACKAGES[appId]?.name}`);
    } else {
      toast.error("Installation failed");
    }
    setInstalling(null);
  };

  const handleUninstall = (appId: string) => {
    if (uninstallUURApp(appId)) {
      setInstalledApps(getInstalledUURApps());
      toast.success("Package removed");
    }
  };

  const handleRunApp = (appId: string) => {
    setRunningApp(appId);
    setActiveTab('run');
  };

  const handleSubmit = () => {
    if (!submitForm.packageName || !submitForm.githubUrl || !submitForm.author) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!submitForm.githubUrl.includes('github.com')) {
      toast.error("Please provide a valid GitHub URL");
      return;
    }

    const success = addSubmission({
      packageName: submitForm.packageName,
      githubUrl: submitForm.githubUrl,
      author: submitForm.author,
      description: submitForm.description
    });

    if (success) {
      toast.success("Submission received! It will be reviewed soon.");
      setSubmitForm({ packageName: '', githubUrl: '', author: '', description: '' });
    } else {
      toast.error("Submission failed");
    }
  };

  const filteredPackages = Object.values(UUR_REAL_PACKAGES).filter(pkg => 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'browse', label: 'Browse', icon: Package },
    { id: 'installed', label: 'Installed', icon: CheckCircle },
    { id: 'submit', label: 'Submit', icon: Send },
    ...(runningApp ? [{ id: 'run' as Tab, label: 'Running', icon: RefreshCw }] : [])
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-cyan-400" />
          <div>
            <h1 className="font-bold text-cyan-400">UUR Manager</h1>
            <p className="text-xs text-slate-500">UrbanShade User Repository</p>
          </div>
        </div>
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Package Grid */}
            <div className="grid gap-3">
              {filteredPackages.map(pkg => {
                const installed = isUURAppInstalled(pkg.id);
                const isInstalling = installing === pkg.id;
                
                return (
                  <div key={pkg.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-cyan-400">{pkg.name}</h3>
                          {pkg.isOfficial && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">OFFICIAL</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{pkg.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>v{pkg.version}</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {pkg.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" /> {pkg.stars}
                          </span>
                          <span>by {pkg.author}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {installed ? (
                          <>
                            <button
                              onClick={() => handleRunApp(pkg.id)}
                              className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30"
                            >
                              Run
                            </button>
                            <button
                              onClick={() => handleUninstall(pkg.id)}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleInstall(pkg.id)}
                            disabled={isInstalling}
                            className="px-4 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isInstalling ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Installing...
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                Install
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'installed' && (
          <div className="space-y-4">
            {installedApps.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No packages installed yet</p>
                <p className="text-sm">Browse the repository to install packages</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {installedApps.map(app => (
                  <div key={app.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-100">{app.name}</h3>
                          <span className="text-xs text-slate-500">v{app.version}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Installed {new Date(app.installedAt).toLocaleDateString()} • {app.source}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRunApp(app.id)}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30"
                        >
                          Run
                        </button>
                        <button
                          onClick={() => handleUninstall(app.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center mb-8">
              <Github className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-slate-100">Submit a Package</h2>
              <p className="text-sm text-slate-400 mt-2">
                Submit your GitHub repository for review. Approved packages will be added to UUR.
              </p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <p className="font-medium">Submission Guidelines</p>
                  <ul className="mt-2 space-y-1 text-amber-200/80 text-xs">
                    <li>• Repository must be public on GitHub</li>
                    <li>• Include a README with installation instructions</li>
                    <li>• Package must be compatible with UrbanShade OS</li>
                    <li>• No malicious code or harmful content</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Package Name *</label>
                <input
                  type="text"
                  value={submitForm.packageName}
                  onChange={(e) => setSubmitForm(s => ({ ...s, packageName: e.target.value }))}
                  placeholder="my-awesome-package"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">GitHub URL *</label>
                <input
                  type="url"
                  value={submitForm.githubUrl}
                  onChange={(e) => setSubmitForm(s => ({ ...s, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Author Name *</label>
                <input
                  type="text"
                  value={submitForm.author}
                  onChange={(e) => setSubmitForm(s => ({ ...s, author: e.target.value }))}
                  placeholder="Your name or username"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm(s => ({ ...s, description: e.target.value }))}
                  placeholder="Briefly describe what your package does..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-cyan-500/20 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit for Review
              </button>
            </div>

            {/* Show pending submissions */}
            {getSubmissions().filter(s => s.status === 'pending').length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Your Pending Submissions</h3>
                <div className="space-y-2">
                  {getSubmissions().filter(s => s.status === 'pending').map(sub => (
                    <div key={sub.packageName} className="p-3 bg-slate-800/50 rounded-lg text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">{sub.packageName}</span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'run' && runningApp && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Running:</span>
                <span className="text-sm font-medium text-cyan-400">{UUR_REAL_PACKAGES[runningApp]?.name}</span>
              </div>
              <button
                onClick={() => { setRunningApp(null); setActiveTab('installed'); }}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:bg-slate-700"
              >
                Close App
              </button>
            </div>
            <div 
              className="flex-1 rounded-lg overflow-hidden border border-slate-700"
              dangerouslySetInnerHTML={{ __html: getUURAppHtml(runningApp) || '<p>App not found</p>' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UURApp;
