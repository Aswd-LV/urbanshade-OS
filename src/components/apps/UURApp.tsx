import { useState, useEffect } from "react";
import { Package, Download, Star, CheckCircle, Trash2, RefreshCw, Send, Github, AlertCircle, Search, List, Plus, Shield, AlertTriangle, X, Filter, LayoutGrid, BarChart3, Clock, User, ExternalLink, Play, Loader2 } from "lucide-react";
import { 
  UUR_REAL_PACKAGES, 
  getUURAppHtml, 
  getInstalledUURApps, 
  installUURApp, 
  uninstallUURApp,
  isUURAppInstalled,
  getOfficialList,
  getCustomLists,
  addCustomList,
  removeCustomList,
  getAllPackages,
  UUR_CATEGORIES,
  type InstalledUURApp,
  type UURList,
  type UURPackage,
  type UURCategory
} from "@/lib/uurRepository";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UURAppProps {
  onClose: () => void;
}

type Tab = 'browse' | 'installed' | 'lists' | 'submit' | 'run';

interface CloudSubmission {
  id: string;
  package_name: string;
  github_url: string;
  author: string;
  description: string | null;
  status: string;
  submitted_at: string;
}

export const UURApp = ({ onClose }: UURAppProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [installedApps, setInstalledApps] = useState<InstalledUURApp[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);
  const [runningApp, setRunningApp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPackages, setAllPackages] = useState<UURPackage[]>([]);
  const [customLists, setCustomLists] = useState<UURList[]>([]);
  const [showImportWarning, setShowImportWarning] = useState(false);
  const [importData, setImportData] = useState({ url: '', name: '' });
  const [selectedCategory, setSelectedCategory] = useState<UURCategory | 'all'>('all');
  const [cloudSubmissions, setCloudSubmissions] = useState<CloudSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Submit form
  const [submitForm, setSubmitForm] = useState({
    packageName: '',
    githubUrl: '',
    author: '',
    description: ''
  });

  useEffect(() => {
    setInstalledApps(getInstalledUURApps());
    setAllPackages(getAllPackages());
    setCustomLists(getCustomLists());
    fetchCloudSubmissions();
  }, []);

  const fetchCloudSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const { data, error } = await supabase
        .from('uur_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      setCloudSubmissions(data || []);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const refreshPackages = () => {
    setAllPackages(getAllPackages());
    setCustomLists(getCustomLists());
    setInstalledApps(getInstalledUURApps());
  };

  const handleInstall = async (appId: string, listSource?: string) => {
    setInstalling(appId);
    await new Promise(r => setTimeout(r, 1500));
    
    const pkg = allPackages.find(p => p.id === appId);
    if (installUURApp(appId, listSource)) {
      refreshPackages();
      toast.success(`Installed ${pkg?.name || appId}`);
    } else {
      toast.error("Installation failed");
    }
    setInstalling(null);
  };

  const handleUninstall = (appId: string) => {
    if (uninstallUURApp(appId)) {
      refreshPackages();
      toast.success("Package removed");
    }
  };

  const handleRunApp = (appId: string) => {
    setRunningApp(appId);
    setActiveTab('run');
  };

  const handleSubmit = async () => {
    if (!submitForm.packageName || !submitForm.githubUrl || !submitForm.author) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!submitForm.githubUrl.includes('github.com')) {
      toast.error("Please provide a valid GitHub URL");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('uur_submissions')
        .insert({
          package_name: submitForm.packageName,
          github_url: submitForm.githubUrl,
          author: submitForm.author,
          description: submitForm.description || null
        });

      if (error) throw error;
      
      toast.success("Submission sent to cloud! It will be reviewed soon.");
      setSubmitForm({ packageName: '', githubUrl: '', author: '', description: '' });
      fetchCloudSubmissions();
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit - check your connection");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportList = () => {
    if (!importData.url || !importData.name) {
      toast.error("Please provide list URL and name");
      return;
    }

    const mockPackages: UURPackage[] = [
      {
        id: `${importData.name}-sample`,
        name: `${importData.name} Sample Package`,
        description: 'Sample package from imported list',
        version: '1.0.0',
        author: 'Community',
        category: 'app',
        downloads: 0,
        stars: 0,
        isOfficial: false,
        listSource: importData.name
      }
    ];

    const success = addCustomList({
      id: importData.name.toLowerCase().replace(/\s+/g, '-'),
      name: importData.name,
      url: importData.url,
      description: `Custom list imported from ${importData.url}`,
      packages: mockPackages
    });

    if (success) {
      toast.success(`List "${importData.name}" imported successfully`);
      setImportData({ url: '', name: '' });
      setShowImportWarning(false);
      refreshPackages();
    } else {
      toast.error("Failed to import list. It may already exist.");
    }
  };

  const handleRemoveList = (listId: string) => {
    if (removeCustomList(listId)) {
      toast.success("List removed");
      refreshPackages();
    }
  };

  const filteredPackages = allPackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: allPackages.length,
    installed: installedApps.length,
    official: allPackages.filter(p => p.isOfficial).length,
    community: allPackages.filter(p => !p.isOfficial).length
  };

  return (
    <div className="h-full flex bg-slate-950 text-white">
      {/* Import Warning Modal */}
      {showImportWarning && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-red-500/50 rounded-xl overflow-hidden">
            <div className="bg-red-500/20 border-b border-red-500/30 p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="font-bold text-red-400">Custom List Import Warning</h3>
              <button onClick={() => setShowImportWarning(false)} className="ml-auto p-1 hover:bg-red-500/20 rounded">
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
            
            <ScrollArea className="max-h-96">
              <div className="p-4 space-y-4">
                <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg text-sm text-red-200 space-y-3">
                  <p className="font-bold text-red-400">⚠️ IMPORTANT: Read Before Proceeding</p>
                  <p>You are about to import a <strong>custom package list</strong> from an external source.</p>
                  <ul className="list-disc list-inside space-y-1 text-red-200/80 text-xs">
                    <li>Packages may contain <strong>unverified or malicious code</strong></li>
                    <li>Packages are <strong>not reviewed</strong> for security</li>
                    <li>The list maintainer could add harmful content at any time</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">List Name *</label>
                    <input
                      type="text"
                      value={importData.name}
                      onChange={(e) => setImportData(d => ({ ...d, name: e.target.value }))}
                      placeholder="My Custom List"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">GitHub Repository URL *</label>
                    <input
                      type="url"
                      value={importData.url}
                      onChange={(e) => setImportData(d => ({ ...d, url: e.target.value }))}
                      placeholder="https://github.com/user/uur-list"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowImportWarning(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportList}
                    disabled={!importData.name || !importData.url}
                    className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border border-red-500/30"
                  >
                    Import List
                  </button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-slate-900/80 border-r border-cyan-500/20 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-cyan-400">UUR Manager</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Advanced Package Control</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-cyan-500/10">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-slate-800/50 text-center">
              <div className="text-lg font-bold text-cyan-400">{stats.total}</div>
              <div className="text-[10px] text-slate-500">Total</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/50 text-center">
              <div className="text-lg font-bold text-green-400">{stats.installed}</div>
              <div className="text-[10px] text-slate-500">Installed</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/50 text-center">
              <div className="text-lg font-bold text-blue-400">{stats.official}</div>
              <div className="text-[10px] text-slate-500">Official</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/50 text-center">
              <div className="text-lg font-bold text-amber-400">{stats.community}</div>
              <div className="text-[10px] text-slate-500">Community</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {[
            { id: 'browse' as Tab, label: 'Browse Packages', icon: LayoutGrid },
            { id: 'installed' as Tab, label: 'Installed', icon: CheckCircle },
            { id: 'lists' as Tab, label: 'Package Lists', icon: List },
            { id: 'submit' as Tab, label: 'Submit Package', icon: Send },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          
          {runningApp && (
            <button
              onClick={() => setActiveTab('run')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'run'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'text-green-400 hover:bg-green-500/10'
              }`}
            >
              <Play className="w-4 h-4" />
              Running App
            </button>
          )}
        </nav>

        {/* Categories Filter (only in browse) */}
        {activeTab === 'browse' && (
          <div className="p-3 border-t border-cyan-500/10">
            <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
              <Filter className="w-3 h-3" />
              CATEGORIES
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                All Categories
              </button>
              {UUR_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-slate-900/50">
          <div className="flex items-center gap-4">
            {activeTab === 'browse' && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            )}
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <BarChart3 className="w-4 h-4" />
              <span>{filteredPackages.length} packages</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-4">
          {activeTab === 'browse' && (
            <div className="grid gap-3">
              {filteredPackages.map(pkg => {
                const installed = isUURAppInstalled(pkg.id);
                const isInstalling = installing === pkg.id;
                const category = UUR_CATEGORIES.find(c => c.id === pkg.category);
                
                return (
                  <div key={pkg.id} className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${category?.color || 'bg-slate-800'} text-2xl`}>
                        {category?.icon || '📦'}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{pkg.name}</h3>
                          <span className="text-xs text-slate-500">v{pkg.version}</span>
                          {pkg.isOfficial ? (
                            <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full flex items-center gap-1 border border-green-500/30">
                              <Shield className="w-2.5 h-2.5" /> OFFICIAL
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                              {pkg.listSource || 'COMMUNITY'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{pkg.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {pkg.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {pkg.downloads.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" /> {pkg.stars}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        {installed ? (
                          <>
                            <button
                              onClick={() => handleRunApp(pkg.id)}
                              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 flex items-center gap-2 border border-green-500/30"
                            >
                              <Play className="w-4 h-4" /> Run
                            </button>
                            <button
                              onClick={() => handleUninstall(pkg.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleInstall(pkg.id, pkg.listSource)}
                            disabled={isInstalling}
                            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 disabled:opacity-50 flex items-center gap-2 border border-cyan-500/30"
                          >
                            {isInstalling ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Installing...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" /> Install
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredPackages.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No packages found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'installed' && (
            <div className="space-y-3">
              {installedApps.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No packages installed</p>
                  <p className="text-sm">Browse the repository to install packages</p>
                </div>
              ) : (
                installedApps.map(app => {
                  const category = UUR_CATEGORIES.find(c => c.id === (allPackages.find(p => p.id === app.id)?.category));
                  return (
                    <div key={app.id} className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${category?.color || 'bg-slate-800'} text-xl`}>
                        {category?.icon || '📦'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{app.name}</h3>
                          <span className="text-xs text-slate-500">v{app.version}</span>
                          {app.source === 'official' ? (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">Official</span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">{app.listSource || 'Community'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Clock className="w-3 h-3" />
                          Installed {new Date(app.installedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRunApp(app.id)}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" /> Run
                        </button>
                        <button
                          onClick={() => handleUninstall(app.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'lists' && (
            <div className="space-y-6">
              {/* Official List */}
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  Official Repository
                </h3>
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-green-400">{getOfficialList().name}</h4>
                        <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full border border-green-500/30">VERIFIED</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{getOfficialList().description}</p>
                      <p className="text-xs text-slate-500">{getOfficialList().packages.length} packages available</p>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/30">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Lists */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <List className="w-4 h-4 text-amber-400" />
                    Custom Lists
                  </h3>
                  <button
                    onClick={() => setShowImportWarning(true)}
                    className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30 flex items-center gap-1.5 border border-amber-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Import List
                  </button>
                </div>
                
                {customLists.length === 0 ? (
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                    <List className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No custom lists imported</p>
                    <p className="text-xs text-slate-600 mt-1">Import a list to access community packages</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customLists.map(list => (
                      <div key={list.id} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-amber-400">{list.name}</h4>
                              <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">UNVERIFIED</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-2">{list.description}</p>
                            <div className="text-xs text-slate-500 flex items-center gap-3">
                              <span>{list.packages.length} packages</span>
                              <span>Added {new Date(list.addedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveList(list.id)}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 mb-4">
                  <Github className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Submit a Package</h2>
                <p className="text-sm text-slate-400 mt-2">
                  Submit your GitHub repository for review. Approved packages will be added to UUR.
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-200">
                    <p className="font-semibold mb-2">Submission Guidelines</p>
                    <ul className="space-y-1 text-amber-200/80 text-xs">
                      <li>• Repository must be public on GitHub</li>
                      <li>• Include a README with installation instructions</li>
                      <li>• Package must be compatible with UrbanShade OS</li>
                      <li>• No malicious code or harmful content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Package Name *</label>
                  <input
                    type="text"
                    value={submitForm.packageName}
                    onChange={(e) => setSubmitForm(s => ({ ...s, packageName: e.target.value }))}
                    placeholder="my-awesome-package"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">GitHub URL *</label>
                  <input
                    type="url"
                    value={submitForm.githubUrl}
                    onChange={(e) => setSubmitForm(s => ({ ...s, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Author Name *</label>
                  <input
                    type="text"
                    value={submitForm.author}
                    onChange={(e) => setSubmitForm(s => ({ ...s, author: e.target.value }))}
                    placeholder="Your name or username"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Description</label>
                  <textarea
                    value={submitForm.description}
                    onChange={(e) => setSubmitForm(s => ({ ...s, description: e.target.value }))}
                    placeholder="Briefly describe what your package does..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-lg font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center gap-2 border border-cyan-500/30 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit to Cloud
                    </>
                  )}
                </button>
              </div>

              {/* Cloud Submissions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300">Recent Submissions (Cloud)</h3>
                  <button
                    onClick={fetchCloudSubmissions}
                    disabled={loadingSubmissions}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                
                {loadingSubmissions ? (
                  <div className="text-center py-8 text-slate-500">
                    <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">Loading submissions...</p>
                  </div>
                ) : cloudSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cloudSubmissions.slice(0, 10).map(sub => (
                      <div key={sub.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-200">{sub.package_name}</span>
                              <span className="text-xs text-slate-500">by {sub.author}</span>
                            </div>
                            <a 
                              href={sub.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {sub.github_url}
                            </a>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sub.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            sub.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'run' && runningApp && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-slate-400">Running:</span>
                  <span className="font-semibold text-green-400">
                    {allPackages.find(p => p.id === runningApp)?.name || runningApp}
                  </span>
                </div>
                <button
                  onClick={() => { setRunningApp(null); setActiveTab('installed'); }}
                  className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Close App
                </button>
              </div>
              <div 
                className="flex-1 rounded-xl overflow-hidden border border-slate-700 bg-white"
                dangerouslySetInnerHTML={{ __html: getUURAppHtml(runningApp) || '<p style="padding: 20px; color: #888;">App not found</p>' }}
              />
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default UURApp;
