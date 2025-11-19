-- Delete all existing data to clean up database
DELETE FROM public.audit_logs;
DELETE FROM public.security_settings;
DELETE FROM public.vault_items;
DELETE FROM public.users;
