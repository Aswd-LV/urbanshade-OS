
-- Create admin_pins table for 2FA PIN storage
CREATE TABLE admin_pins (
  user_id UUID PRIMARY KEY,
  pin_hash TEXT NOT NULL,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage own pin"
  ON admin_pins FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = user_id);

-- Create admin_notes table
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL,
  author_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notes"
  ON admin_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Update has_role to treat trial_admin like admin for panel access
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = _role
        OR (role = 'creator' AND _role IN ('admin', 'moderator', 'user'))
        OR (role = 'admin' AND _role IN ('moderator', 'user'))
        OR (role = 'moderator' AND _role = 'user')
        OR (role = 'trial_admin' AND _role IN ('admin', 'moderator', 'user'))
      )
  )
$$;

-- Update get_user_role to include trial_admin priority
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role 
      WHEN 'creator' THEN 1 
      WHEN 'admin' THEN 2 
      WHEN 'trial_admin' THEN 3
      WHEN 'moderator' THEN 4 
      WHEN 'user' THEN 5 
    END
  LIMIT 1
$$;
