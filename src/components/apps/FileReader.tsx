import { useState, useEffect } from "react";
import { FileText, Search, Folder, AlertTriangle, Lock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface FileContent {
  path: string;
  name: string;
  content: string;
  encrypted?: boolean;
  dangerous?: boolean;
}

const FILE_DATABASE: Record<string, FileContent> = {
  "VirusScanner.exe": {
    path: "/archive/VirusScanner.exe",
    name: "VirusScanner.exe",
    content: `[EXECUTING...]

> Initializing system scan...
> Analyzing memory...
> Checking processes...

[!] CRITICAL ERROR: MALICIOUS CODE DETECTED
[!] SYSTEM CORRUPTION IN PROGRESS
[!] ATTEMPTING TO QUARANTINE...

[FAILED]

█████████████ SYSTEM COMPROMISED █████████████

All your base are belong to us.

--- END OF FILE ---`,
    dangerous: true
  },
  "pressure_001.txt": {
    path: "/archive/pressure_001.txt",
    name: "pressure_001.txt",
    content: `EXPERIMENT LOG #001
Subject: Z-13 'Pressure'
Status: Contained
Threat Level: EXTREME

Notes: Subject demonstrates adaptive behavior in high-pressure 
environments. Recommend increased security protocols.

Behavioral Patterns:
- Responds to depth changes
- Exhibits territorial aggression
- Unknown communication method detected

Last Updated: 2024-02-28 16:45
Researcher: Dr. [REDACTED]

--- END OF FILE ---`
  },
  "urbcore.dll": {
    path: "/system/urbcore.dll",
    name: "urbcore.dll",
    content: `[SYSTEM LIBRARY FILE]

UrbanShade Core Library v2.4.1
Build: 2024-03-10 08:00

CRITICAL: DO NOT DELETE OR MODIFY

This file contains essential system functions:
- Boot management
- Memory allocation
- Process scheduling
- Security protocols
- Network communication
- Facility monitoring

Dependencies: bootmgr.sys, security.sys

--- END OF FILE ---`
  },
  "experiment_log.dat": {
    path: "/archive/experiment_log.dat",
    name: "experiment_log.dat",
    content: `[ENCRYPTED FILE]

Access Level: 4 Required
Encryption: AES-256

[FILE CONTENTS PROTECTED]

Please authenticate with security credentials to view contents.

--- END OF FILE ---`,
    encrypted: true
  },
  "project_hadal.pdf": {
    path: "/archive/classified/project_hadal.pdf",
    name: "project_hadal.pdf",
    content: `[TOP SECRET DOCUMENT]

Classification: Level 5
Project: HADAL

[DOCUMENT ENCRYPTED]

Access requires Top Secret clearance and biometric verification.

Unauthorized access will be logged and reported to security.

--- END OF FILE ---`,
    encrypted: true
  },
  "system_log.txt": {
    path: "/logs/system_log.txt",
    name: "system_log.txt",
    content: `[SYSTEM LOG]

[16:22:15] System boot successful
[16:22:18] All core modules loaded
[16:22:20] Network connection established
[16:20:45] WARNING: Pressure anomaly detected in Zone 4
[16:19:30] Containment check: All secure
[16:18:15] Temperature stable: 18.5°C
[16:17:00] Backup systems: Operational
[16:15:45] Security scan: Complete
[16:14:30] Database sync: Success

--- END OF LOG ---`
  },
  "notes.txt": {
    path: "/user/notes.txt",
    name: "notes.txt",
    content: `Personal Notes:

TODO:
- Check pressure readings in Zone 7
- Review specimen containment protocols
- Meeting with Dr. Chen at 1400 hours
- Update security clearances
- Inspect backup generators

Observations:
Subject behavior in Zone 4 has been unusual.
Need to monitor more closely.

--- END OF FILE ---`
  },
  "DELETED_DO_NOT_OPEN.█████": {
    path: "/archive/DELETED_DO_NOT_OPEN.█████",
    name: "DELETED_DO_NOT_OPEN.█████",
    content: `[FILE CORRUPTED]

[WARNING: UNAUTHORIZED ACCESS DETECTED]
[TRACING CONNECTION...]

...they're watching...
...always watching...
...in the dark...
...below...

[CONNECTION TERMINATED]
[ERROR: FILE INTEGRITY COMPROMISED]

--- CORRUPTED DATA ---`,
    dangerous: true
  }
};

export const FileReader = () => {
  const [selectedFile, setSelectedFile] = useState<FileContent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("file_reader_recent");
    if (stored) {
      setRecentFiles(JSON.parse(stored));
    }
  }, []);

  const addToRecent = (filename: string) => {
    const updated = [filename, ...recentFiles.filter(f => f !== filename)].slice(0, 5);
    setRecentFiles(updated);
    localStorage.setItem("file_reader_recent", JSON.stringify(updated));
  };

  const openFile = (filename: string) => {
    const file = FILE_DATABASE[filename];
    if (file) {
      setSelectedFile(file);
      setEditedContent(file.content);
      setIsEditing(false);
      addToRecent(filename);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      FILE_DATABASE[selectedFile.name].content = editedContent;
      setSelectedFile({ ...selectedFile, content: editedContent });
      setIsEditing(false);
      toast.success("File saved successfully!");
    }
  };

  const availableFiles = Object.values(FILE_DATABASE);
  const filteredFiles = searchQuery
    ? availableFiles.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFiles;

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r bg-gradient-to-b from-muted/40 to-muted/20 flex flex-col shadow-lg">
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            File Reader
          </h2>
          <p className="text-xs text-muted-foreground mt-1">View and edit file contents</p>
        </div>

        {/* Search */}
        <div className="p-3 border-b bg-background/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-9 h-9 bg-background border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Recent Files */}
        {recentFiles.length > 0 && !searchQuery && (
          <div className="p-3 border-b bg-primary/5">
            <div className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              RECENT FILES
            </div>
            <div className="space-y-1">
              {recentFiles.map(filename => {
                const file = FILE_DATABASE[filename];
                if (!file) return null;
                return (
                  <button
                    key={filename}
                    onClick={() => openFile(filename)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-primary/10 transition-all hover:translate-x-1 text-left border border-transparent hover:border-primary/20"
                  >
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate font-medium">{filename}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* File List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            <div className="text-xs font-bold text-muted-foreground px-2 py-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-muted-foreground/50 rounded-full" />
              ALL FILES ({filteredFiles.length})
            </div>
            {filteredFiles.map(file => (
              <button
                key={file.name}
                onClick={() => openFile(file.name)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg text-sm transition-all text-left border ${
                  selectedFile?.name === file.name 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02] border-primary' 
                    : 'hover:bg-muted/50 hover:translate-x-1 border-transparent hover:border-border'
                }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-semibold">{file.name}</div>
                  <div className="text-xs opacity-70 truncate">{file.path}</div>
                </div>
                {file.encrypted && <Lock className="w-4 h-4 text-amber-500 shrink-0" />}
                {file.dangerous && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="border-b bg-gradient-to-r from-muted/50 to-muted/30 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Folder className="w-4 h-4" />
                {selectedFile.path.split('/').slice(0, -1).join('/')}
                <ChevronRight className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-2xl flex items-center gap-3">
                  {selectedFile.name}
                  {selectedFile.encrypted && (
                    <span className="text-xs bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/30 font-semibold">
                      <Lock className="w-3 h-3 inline mr-1" />
                      ENCRYPTED
                    </span>
                  )}
                  {selectedFile.dangerous && (
                    <span className="text-xs bg-destructive/20 text-destructive px-3 py-1.5 rounded-lg border border-destructive/30 font-semibold">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      DANGEROUS
                    </span>
                  )}
                </h2>
                <div className="flex gap-2">
                  {!selectedFile.encrypted && !isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                  {isEditing && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => {
                        setIsEditing(false);
                        setEditedContent(selectedFile.content);
                      }}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <Card className="p-6 bg-gradient-to-br from-muted/60 to-muted/30 shadow-lg border-2">
                  {isEditing ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-[500px] font-mono text-sm bg-background/50 p-4 rounded border border-border focus:border-primary focus:outline-none resize-none"
                    />
                  ) : (
                    <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedFile.content}
                    </pre>
                  )}
                </Card>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8 bg-gradient-to-br from-background to-muted/20">
            <div className="max-w-md animate-fade-in">
              <FileText className="w-20 h-20 mx-auto mb-6 text-primary/60 animate-pulse" />
              <h3 className="text-2xl font-bold mb-3">No File Selected</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Select a file from the sidebar to view and edit its contents
              </p>
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 text-left border-2 border-primary/20">
                <div className="font-bold mb-3 text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Available Files:
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>System files (urbcore.dll, bootmgr.sys)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Experiment logs and research data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Personal notes and documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Encrypted classified files</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
