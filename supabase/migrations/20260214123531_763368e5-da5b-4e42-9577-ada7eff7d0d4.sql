
-- Admin access log for tracking panel access and PIN attempts
CREATE TABLE public.admin_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'pin_verify_success', 'pin_verify_fail', 'panel_access', 'pin_set', 'pin_removed', 'force_pin_reset'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_access_log ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs
CREATE POLICY "Admins can view access logs"
  ON public.admin_access_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert logs (via edge function with service role)
CREATE POLICY "System can insert access logs"
  ON public.admin_access_log
  FOR INSERT
  WITH CHECK (true);

-- Index for fast queries
CREATE INDEX idx_admin_access_log_user ON public.admin_access_log(user_id);
CREATE INDEX idx_admin_access_log_created ON public.admin_access_log(created_at DESC);
