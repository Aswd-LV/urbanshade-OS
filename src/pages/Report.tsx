import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Send, Shield, User, Bug, MessageSquare, Loader2, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ReportType = 'user' | 'bug' | 'content' | 'security' | 'other';

interface ReportForm {
  type: ReportType;
  title: string;
  description: string;
  reportedUsername?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const Report = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ReportForm>({
    type: 'bug',
    title: '',
    description: '',
    reportedUsername: '',
    priority: 'medium'
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const reportTypes = [
    { value: 'user', label: 'Report User', icon: User, description: 'Report inappropriate behavior from another user' },
    { value: 'bug', label: 'Bug Report', icon: Bug, description: 'Report a bug or technical issue' },
    { value: 'content', label: 'Content Issue', icon: MessageSquare, description: 'Report inappropriate content' },
    { value: 'security', label: 'Security Concern', icon: Shield, description: 'Report a security vulnerability' },
    { value: 'other', label: 'Other', icon: FileText, description: 'Other issues not covered above' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.type === 'user' && !form.reportedUsername?.trim()) {
      toast.error("Please enter the username of the user you're reporting");
      return;
    }

    setLoading(true);
    
    try {
      // Look up reported user if it's a user report
      let reportedUserId: string | null = null;
      if (form.type === 'user' && form.reportedUsername) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('username', form.reportedUsername.trim())
          .single();
        
        if (profile) {
          reportedUserId = profile.user_id;
        }
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user?.id || null,
          reported_user_id: reportedUserId,
          report_type: form.type,
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch (err: any) {
      console.error('Failed to submit report:', err);
      toast.error(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-black/60 border-green-500/30">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-green-400">Report Submitted</h2>
            <p className="text-muted-foreground">
              Thank you for your report. Our moderation team will review it and take appropriate action.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
              <Button onClick={() => {
                setSubmitted(false);
                setForm({ type: 'bug', title: '', description: '', reportedUsername: '', priority: 'medium' });
              }}>
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-amber-400">Submit Report</h1>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle>Report an Issue</CardTitle>
            <CardDescription>
              Help us keep UrbanShade safe and working properly. All reports are reviewed by our moderation team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <Label>Report Type *</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {reportTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: type.value as ReportType })}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        form.type === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 hover:border-white/20 bg-black/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <type.icon className={`w-5 h-5 ${form.type === type.value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Username field for user reports */}
              {form.type === 'user' && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username of Reported User *</Label>
                  <Input
                    id="username"
                    placeholder="Enter their username"
                    value={form.reportedUsername}
                    onChange={(e) => setForm({ ...form, reportedUsername: e.target.value })}
                    className="bg-black/40 border-white/10"
                  />
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of the issue"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-black/40 border-white/10"
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-black/40 border-white/10 min-h-[150px]"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {form.description.length}/2000
                </p>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as any })}>
                  <SelectTrigger className="bg-black/40 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor issue</SelectItem>
                    <SelectItem value="medium">Medium - Standard priority</SelectItem>
                    <SelectItem value="high">High - Urgent issue</SelectItem>
                    <SelectItem value="critical">Critical - Immediate attention needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {!user && (
          <Card className="mt-6 bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-400">Not logged in</p>
                  <p className="text-sm text-muted-foreground">
                    You can still submit a report, but we won't be able to follow up with you about its status.
                    <Link to="/" className="text-primary hover:underline ml-1">Log in</Link> for the best experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Report;
