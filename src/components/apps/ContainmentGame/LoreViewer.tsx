import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, FileText, AlertTriangle, Users, Radio, Lock } from 'lucide-react';
import { getUnlockedDocuments, getDocumentById, LORE_DOCUMENTS } from './data/loreDocuments';
import { LoreDocument } from './types';
import { cn } from '@/lib/utils';

interface LoreViewerProps {
  unlockedNights: number[];
  onBack: () => void;
}

const CATEGORY_ICONS = {
  incident: AlertTriangle,
  dossier: Users,
  protocol: FileText,
  communication: Radio
};

const CATEGORY_LABELS = {
  incident: 'Incident Reports',
  dossier: 'Subject Dossiers',
  protocol: 'Protocols',
  communication: 'Communications'
};

export const LoreViewer = ({ unlockedNights, onBack }: LoreViewerProps) => {
  const [selectedDoc, setSelectedDoc] = useState<LoreDocument | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const maxNight = Math.max(...unlockedNights);
  const unlockedDocs = getUnlockedDocuments(unlockedNights);
  
  // Group documents by category
  const docsByCategory = unlockedDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, LoreDocument[]>);

  // Count locked documents
  const lockedCount = LORE_DOCUMENTS.length - unlockedDocs.length;

  if (selectedDoc) {
    const Icon = CATEGORY_ICONS[selectedDoc.category];
    
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center gap-2 p-3 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(null)}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground uppercase">
                {CATEGORY_LABELS[selectedDoc.category]}
              </span>
            </div>
            
            <h1 className="text-xl font-bold mb-4">{selectedDoc.title}</h1>
            
            <div className="prose prose-sm prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-muted/30 p-4 rounded-lg border border-border">
                {selectedDoc.content}
              </pre>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <span className="flex-1 font-bold">Documents Archive</span>
        <span className="text-xs text-muted-foreground">
          {unlockedDocs.length}/{LORE_DOCUMENTS.length} unlocked
        </span>
      </div>

      <ScrollArea className="flex-1 p-4">
        {unlockedDocs.length === 0 ? (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents unlocked yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete nights to unlock lore.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(docsByCategory).map(([category, docs]) => {
              const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-bold text-muted-foreground uppercase">
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </h2>
                  </div>
                  
                  <div className="space-y-1">
                    {docs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full text-left p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="font-medium text-sm">{doc.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Unlocked after Night {doc.unlockedAfterNight}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Locked documents teaser */}
            {lockedCount > 0 && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-bold text-muted-foreground uppercase">
                    Classified ({lockedCount})
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete more nights to access classified documents.
                </p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
