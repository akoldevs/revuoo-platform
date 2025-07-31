-- 068_create_add_role_to_user_function.sql

CREATE OR REPLACE FUNCTION add_role_to_user(p_user_id UUID, p_role TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET roles = array_append(roles, p_role)
    WHERE id = p_user_id
    AND NOT (p_role = ANY(roles));
END;
$$ LANGUAGE plpgsql;