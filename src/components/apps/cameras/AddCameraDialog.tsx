import { useState } from "react";
import { Plus, Camera, Loader2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IPCamera } from "@/hooks/useIPCameras";
import { toast } from "sonner";

interface AddCameraDialogProps {
  onAdd: (camera: Omit<IPCamera, 'id' | 'createdAt' | 'status'>) => void;
  testConnection: (url: string, protocol: IPCamera['protocol']) => Promise<boolean>;
}

const ZONE_OPTIONS = [
  { value: 'surface', label: 'Surface Zone' },
  { value: 'entrance', label: 'Entrance Zone' },
  { value: 'light', label: 'Light Containment' },
  { value: 'heavy', label: 'Heavy Containment' },
  { value: 'external', label: 'External' },
  { value: 'custom', label: 'Custom Location' },
];

export const AddCameraDialog = ({ onAdd, testConnection }: AddCameraDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [protocol, setProtocol] = useState<IPCamera['protocol']>('mjpeg');
  const [zone, setZone] = useState('external');
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleTest = async () => {
    if (!url) {
      toast.error('Please enter a URL first');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const success = await testConnection(url, protocol);
    setTestResult(success);
    setIsTesting(false);

    if (success) {
      toast.success('Connection successful!');
    } else {
      toast.error('Connection failed - check URL and network access');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Camera name is required');
      return;
    }

    if (!url.trim() && protocol !== 'simulated') {
      toast.error('Stream URL is required');
      return;
    }

    onAdd({
      name: name.trim(),
      url: url.trim(),
      protocol,
      zone,
      refreshInterval: protocol === 'image' ? refreshInterval : undefined,
    });

    toast.success(`Camera "${name}" added successfully`);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setName('');
    setUrl('');
    setProtocol('mjpeg');
    setZone('external');
    setRefreshInterval(5);
    setTestResult(null);
  };

  const detectProtocol = (inputUrl: string) => {
    const lower = inputUrl.toLowerCase();
    if (lower.includes('.m3u8')) {
      setProtocol('hls');
    } else if (lower.includes('mjpg') || lower.includes('mjpeg') || lower.includes('/video')) {
      setProtocol('mjpeg');
    } else if (lower.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)) {
      setProtocol('image');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Add IP Camera
          </DialogTitle>
          <DialogDescription>
            Connect an IP camera by providing its stream URL. Supports MJPEG streams, static images with refresh, and simulated feeds.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Camera Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Camera Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Front Entrance, Server Room"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Protocol Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="protocol">Stream Type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[250px]">
                    <p className="text-xs">
                      <strong>MJPEG:</strong> Motion JPEG stream (most common)<br />
                      <strong>Image:</strong> Static image with auto-refresh<br />
                      <strong>HLS:</strong> HTTP Live Streaming (.m3u8)<br />
                      <strong>Simulated:</strong> Blueprint-style placeholder
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={protocol} onValueChange={(v) => setProtocol(v as IPCamera['protocol'])}>
              <SelectTrigger id="protocol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mjpeg">MJPEG Stream</SelectItem>
                <SelectItem value="image">Static Image (Auto-refresh)</SelectItem>
                <SelectItem value="hls">HLS Stream (.m3u8)</SelectItem>
                <SelectItem value="simulated">Simulated Feed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stream URL */}
          {protocol !== 'simulated' && (
            <div className="space-y-2">
              <Label htmlFor="url">Stream URL *</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="http://192.168.1.100:8080/video"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    detectProtocol(e.target.value);
                    setTestResult(null);
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTest}
                  disabled={isTesting || !url}
                  className="w-20"
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : testResult === true ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : testResult === false ? (
                    <XCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    'Test'
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Common formats: http://ip:port/video, http://ip/mjpg/video.mjpg
              </p>
            </div>
          )}

          {/* Refresh Interval (for image protocol) */}
          {protocol === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="refresh">Refresh Interval (seconds)</Label>
              <Input
                id="refresh"
                type="number"
                min={1}
                max={60}
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 5)}
              />
            </div>
          )}

          {/* Zone Selection */}
          <div className="space-y-2">
            <Label htmlFor="zone">Location / Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger id="zone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZONE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info box */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> IP cameras must be accessible from your browser. 
              Many cameras require local network access. RTSP streams are not directly supported 
              in browsers - use MJPEG or a transcoding server.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Camera
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
