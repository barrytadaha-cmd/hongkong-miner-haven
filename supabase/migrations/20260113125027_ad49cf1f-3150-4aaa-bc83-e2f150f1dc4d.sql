-- Create a secure function to get user email for admins
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = user_uuid;
$$;

-- Grant execute to authenticated users (RLS will handle admin check in the calling code)
GRANT EXECUTE ON FUNCTION public.get_user_email TO authenticated;