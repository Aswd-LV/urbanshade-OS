import { useState, useEffect } from "react";
import { Award, Trophy, Star, Calendar, Download, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCertificates, Certificate } from "@/hooks/useCertificates";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type TabType = 'all' | 'battlepass' | 'achievement';

const RARITY_STYLES = {
  epic: {
    gradient: 'from-purple-600 to-pink-500',
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/25',
    text: 'text-purple-400',
  },
  legendary: {
    gradient: 'from-yellow-500 to-orange-500',
    border: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/25',
    text: 'text-yellow-400',
  },
  battlepass: {
    gradient: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500/50',
    glow: 'shadow-cyan-500/25',
    text: 'text-cyan-400',
  },
};

export const CertificateViewer = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  const { certificates, loading, getBattlePassCertificates, getAchievementCertificates } = useCertificates(userId);

  const filteredCerts = activeTab === 'all' 
    ? certificates 
    : activeTab === 'battlepass' 
      ? getBattlePassCertificates()
      : getAchievementCertificates();

  const getCertStyle = (cert: Certificate) => {
    if (cert.certificate_type === 'battlepass') {
      return RARITY_STYLES.battlepass;
    }
    return cert.achievement_rarity === 'legendary' 
      ? RARITY_STYLES.legendary 
      : RARITY_STYLES.epic;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading certificates...</div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-8">
        <Award className="w-20 h-20 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">No Certificates Yet</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Earn certificates by reaching Level 100 in a Battle Pass season or unlocking Epic/Legendary achievements!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-background">
      {/* Certificate List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Certificates</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="battlepass" className="text-xs">Pass</TabsTrigger>
              <TabsTrigger value="achievement" className="text-xs">Achieve</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredCerts.map((cert) => {
              const style = getCertStyle(cert);
              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedCert?.id === cert.id 
                      ? `bg-gradient-to-r ${style.gradient} bg-opacity-20 ${style.border}` 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                      {cert.certificate_type === 'battlepass' ? (
                        <Trophy className="w-5 h-5 text-white" />
                      ) : (
                        <Star className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {cert.certificate_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cert.certificate_type === 'battlepass' ? cert.season_key : cert.achievement_rarity}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Certificate Display */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/30">
        {selectedCert ? (
          <CertificateDisplay certificate={selectedCert} />
        ) : (
          <div className="text-center text-muted-foreground">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Select a certificate to view</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CertificateDisplay = ({ certificate }: { certificate: Certificate }) => {
  const style = certificate.certificate_type === 'battlepass'
    ? RARITY_STYLES.battlepass
    : certificate.achievement_rarity === 'legendary'
      ? RARITY_STYLES.legendary
      : RARITY_STYLES.epic;

  return (
    <div className={`relative w-full max-w-lg aspect-[4/3] rounded-2xl border-4 ${style.border} bg-gradient-to-br from-background via-muted/30 to-background shadow-2xl ${style.glow} overflow-hidden`}>
      {/* Decorative corners */}
      <div className={`absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 ${style.border} rounded-tl-lg`} />
      <div className={`absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 ${style.border} rounded-tr-lg`} />
      <div className={`absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 ${style.border} rounded-bl-lg`} />
      <div className={`absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 ${style.border} rounded-br-lg`} />

      {/* Sparkles animation */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className={`absolute top-8 right-8 w-6 h-6 ${style.text} animate-pulse`} />
        <Sparkles className={`absolute bottom-12 left-12 w-4 h-4 ${style.text} animate-pulse delay-300`} />
        <Sparkles className={`absolute top-1/3 right-1/4 w-5 h-5 ${style.text} animate-pulse delay-500`} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-4 shadow-lg`}>
          {certificate.certificate_type === 'battlepass' ? (
            <Trophy className="w-8 h-8 text-white" />
          ) : (
            <Star className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Header */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Certificate of {certificate.certificate_type === 'battlepass' ? 'Completion' : 'Achievement'}
        </p>

        {/* Title */}
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent mb-2`}>
          {certificate.certificate_name}
        </h2>

        {/* Season/Rarity */}
        <Badge className={`${style.text} bg-muted/50 mb-4`}>
          {certificate.certificate_type === 'battlepass' 
            ? `${certificate.season_key} Season` 
            : certificate.achievement_rarity?.toUpperCase()}
        </Badge>

        {/* UrbanShade Signature */}
        <div className="mt-4 pt-4 border-t border-border/50 w-48">
          <p className="text-xs text-muted-foreground">UrbanShade OS</p>
          <p className="text-[10px] text-muted-foreground/70">
            Earned {format(new Date(certificate.earned_at), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};
