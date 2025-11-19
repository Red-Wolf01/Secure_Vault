-- Row Level Security Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Row Level Security Policies for vault_items table
CREATE POLICY "Users can view their own vault items"
  ON public.vault_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault items"
  ON public.vault_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault items"
  ON public.vault_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vault items"
  ON public.vault_items FOR DELETE
  USING (auth.uid() = user_id);

-- Row Level Security Policies for audit_logs table
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Row Level Security Policies for security_settings table
CREATE POLICY "Users can view their own security settings"
  ON public.security_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
  ON public.security_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
  ON public.security_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
