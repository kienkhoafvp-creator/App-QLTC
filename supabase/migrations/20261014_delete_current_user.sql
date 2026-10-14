-- Deletes only the user represented by the JWT that calls this function.
-- Deleting auth.users causes the existing ON DELETE CASCADE foreign keys to
-- remove the financial records that belong to that user.
create or replace function public.delete_current_user()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  deleted_user_id uuid;
begin
  if current_user_id is null then
    raise exception 'Bạn cần đăng nhập trước khi xóa tài khoản.';
  end if;

  delete from auth.users
  where id = current_user_id
  returning id into deleted_user_id;

  if deleted_user_id is null then
    raise exception 'Không tìm thấy tài khoản cần xóa.';
  end if;

  return deleted_user_id;
end;
$$;

revoke all on function public.delete_current_user() from public;
revoke all on function public.delete_current_user() from anon;
grant execute on function public.delete_current_user() to authenticated;
