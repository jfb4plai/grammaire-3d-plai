-- supabase/migrations/20260727000000_add_gram3d_scenes_indexes.sql

create index if not exists gram3d_scenes_user_id_idx
  on public.gram3d_scenes (user_id);

create index if not exists gram3d_scenes_user_id_updated_at_idx
  on public.gram3d_scenes (user_id, updated_at desc);
