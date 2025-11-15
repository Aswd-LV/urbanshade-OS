import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomPropertiesProps {
  room: {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  onClose: () => void;
  onChange: (updates: any) => void;
}

export const RoomProperties = ({ room, onClose, onChange }: RoomPropertiesProps) => {
  if (!room) return null;

  return (
    <div className="absolute top-4 right-4 w-64 bg-background border-2 border-border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Room Properties</h3>
        <Button size="sm" variant="ghost" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Name</Label>
          <Input
            value={room.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-xs">Type</Label>
          <Select value={room.type} onValueChange={(value) => onChange({ type: value })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="control">Control</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="containment">Containment</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="corridor">Corridor</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
              <SelectItem value="observation">Observation</SelectItem>
              <SelectItem value="decontamination">Decontamination</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              value={room.x}
              onChange={(e) => onChange({ x: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              value={room.y}
              onChange={(e) => onChange({ y: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={room.width}
              onChange={(e) => onChange({ width: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={room.height}
              onChange={(e) => onChange({ height: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
