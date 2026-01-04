import { Star, Sparkles, Crown, Zap, Shield, MessageSquare, Palette, Gift } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VipWelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  reason?: string | null;
}

const VIP_PERKS = [
  { icon: Star, title: "VIP Badge", description: "Your messages show a special VIP badge" },
  { icon: Shield, title: "Priority Support", description: "Get faster responses from the team" },
  { icon: MessageSquare, title: "Increased Limits", description: "Higher message rate limits" },
  { icon: Palette, title: "Exclusive Themes", description: "Access to VIP-only theme presets" },
  { icon: Zap, title: "Early Access", description: "Try new features before everyone else" },
  { icon: Gift, title: "Site Lock Bypass", description: "Access even during maintenance" },
];

export const VipWelcomeDialog = ({ open, onClose, reason }: VipWelcomeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-950 via-slate-950 to-pink-950 border-2 border-purple-500/40 shadow-2xl shadow-purple-500/20">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎉 You're a VIP!
          </DialogTitle>
          <DialogDescription className="text-purple-200/80">
            Your contributions have been recognized!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {reason && (
            <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
              <p className="text-sm text-purple-300/70 mb-1">Reason for VIP status:</p>
              <p className="text-purple-200 font-medium">"{reason}"</p>
            </div>
          )}

          <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            YOUR VIP PERKS
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {VIP_PERKS.map((perk, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-slate-900/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <perk.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-200">{perk.title}</span>
                </div>
                <p className="text-xs text-slate-400">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Awesome, let's go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
