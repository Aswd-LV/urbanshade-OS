import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Activity, CheckCircle, XCircle, AlertTriangle, RefreshCw, Clock, 
  ArrowLeft, Database, Globe, FileText, Wrench, LifeBuoy, Flag, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface StatusEntry {
  id: string;
  status: string;
  message: string | null;
  updated_at: string;
}

const StatusPage = () => {
  const [statuses, setStatuses] = useState<StatusEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [supabaseOnline, setSupabaseOnline] = useState<boolean | null>(null);

  const routeLabels: Record<string, { label: string; icon: typeof Activity }> = {
    'main': { label: 'Main Site', icon: Globe },
    'docs': { label: 'Documentation', icon: FileText },
    'def-dev': { label: 'DefDev Mode', icon: Wrench },
    'entire-site': { label: 'Entire Site', icon: Activity }
  };

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('site_status')
        .select('*')
        .order('id');

      if (error) {
        console.error('Failed to fetch status:', error);
        setSupabaseOnline(false);
      } else {
        setStatuses(data || []);
        setSupabaseOnline(true);
      }
    } catch (error) {
      console.error('Status fetch error:', error);
      setSupabaseOnline(false);
    } finally {
      setIsLoading(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'maintenance': return 'text-amber-400';
      case 'offline': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/10 border-green-500/30';
      case 'maintenance': return 'bg-amber-500/10 border-amber-500/30';
      case 'offline': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-muted/10 border-border';
    }
  };

  const overallStatus = () => {
    if (supabaseOnline === false) return 'offline';
    const entireSite = statuses.find(s => s.id === 'entire-site');
    if (entireSite?.status !== 'online') return entireSite?.status || 'offline';
    if (statuses.some(s => s.status === 'offline')) return 'partial';
    if (statuses.some(s => s.status === 'maintenance')) return 'maintenance';
    return 'online';
  };

  const status = overallStatus();
  const entireSiteEntry = statuses.find(s => s.id === 'entire-site');
  const serviceStatuses = statuses.filter(s => s.id !== 'entire-site');

  const quickLinks = [
    { label: 'Report Issue', path: '/report', icon: Flag },
    { label: 'Support', path: '/support', icon: LifeBuoy },
    { label: 'Documentation', path: '/docs', icon: FileText },
    { label: 'Team', path: '/team', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to UrbanShade
          </Link>
          
          <div className="flex items-center gap-5">
            <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${
              status === 'online' ? 'bg-green-500/20 border-green-500/50' :
              status === 'partial' || status === 'maintenance' ? 'bg-amber-500/20 border-amber-500/50' :
              'bg-red-500/20 border-red-500/50'
            }`}>
              {status === 'online' && (
                <div className="absolute inset-0 rounded-2xl bg-green-500/20 animate-ping" />
              )}
              <Activity className={`w-10 h-10 relative z-10 ${
                status === 'online' ? 'text-green-400' :
                status === 'partial' || status === 'maintenance' ? 'text-amber-400' :
                'text-red-400'
              }`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">UrbanShade Status</h1>
              <p className={`mt-1 font-medium ${getStatusColor(status)}`}>
                {status === 'online' && 'All systems operational'}
                {status === 'partial' && 'Some systems experiencing issues'}
                {status === 'maintenance' && 'Maintenance in progress'}
                {status === 'offline' && 'Systems currently offline'}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                99.9% uptime • Last 30 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Refresh Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Checked {formatDistanceToNow(lastCheck, { addSuffix: true })}</span>
          </div>
          <Button 
            onClick={fetchStatus} 
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Database Connection */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${
          supabaseOnline === null ? 'bg-muted/10 border-border' :
          supabaseOnline ? 'bg-green-500/5 border-green-500/30' :
          'bg-red-500/5 border-red-500/30'
        }`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            supabaseOnline ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Database className={`w-5 h-5 ${supabaseOnline ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Database Connection</div>
            <div className="text-xs text-muted-foreground">Core infrastructure</div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            supabaseOnline === null ? 'bg-muted text-muted-foreground' :
            supabaseOnline ? 'bg-green-500/20 text-green-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {supabaseOnline === null ? 'Checking' : supabaseOnline ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Entire Site Status (Featured) */}
        {entireSiteEntry && (
          <div className={`p-6 rounded-2xl border-2 ${getStatusBg(entireSiteEntry.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  entireSiteEntry.status === 'online' ? 'bg-green-500/20' :
                  entireSiteEntry.status === 'maintenance' ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`}>
                  {entireSiteEntry.status === 'online' ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : entireSiteEntry.status === 'maintenance' ? (
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Entire Site</h3>
                  {entireSiteEntry.message ? (
                    <p className="text-sm text-muted-foreground mt-0.5">{entireSiteEntry.message}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {entireSiteEntry.status === 'online' ? 'All services operational' : 'Check individual services below'}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${
                  entireSiteEntry.status === 'online' ? 'bg-green-500/20 text-green-400' :
                  entireSiteEntry.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {entireSiteEntry.status}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(entireSiteEntry.updated_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service Grid */}
        {isLoading && statuses.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Checking status...</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceStatuses.map((entry) => {
              const config = routeLabels[entry.id] || { label: entry.id, icon: Activity };
              const Icon = config.icon;
              
              return (
                <div 
                  key={entry.id}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${getStatusBg(entry.status)}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      entry.status === 'online' ? 'bg-green-500/20' :
                      entry.status === 'maintenance' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      <Icon className={`w-4 h-4 ${getStatusColor(entry.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{config.label}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      entry.status === 'online' ? 'bg-green-500/20 text-green-400' :
                      entry.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {entry.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  {entry.message && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{entry.message}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <div className="pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Need Help?</h3>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-sm"
              >
                <link.icon className="w-4 h-4 text-cyan-400" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
