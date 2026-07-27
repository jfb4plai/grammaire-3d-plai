import { supabase } from './supabase';
import type { SceneData, SceneRecord } from './types';

interface SceneRow {
  id: string;
  titre: string;
  data: SceneData;
  updated_at: string;
}

function fromRow(row: SceneRow): SceneRecord {
  return { id: row.id, titre: row.titre, data: row.data, updatedAt: row.updated_at };
}

export async function listScenes(): Promise<SceneRecord[]> {
  const { data, error } = await supabase
    .from('gram3d_scenes')
    .select('id, titre, data, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as SceneRow[]).map(fromRow);
}

export async function saveScene(titre: string, data: SceneData, id?: string): Promise<SceneRecord> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Utilisateur non authentifié');

  if (id) {
    const { data: row, error } = await supabase
      .from('gram3d_scenes')
      .update({ titre, data })
      .eq('id', id)
      .select('id, titre, data, updated_at')
      .single();
    if (error) throw error;
    return fromRow(row as SceneRow);
  }

  const { data: row, error } = await supabase
    .from('gram3d_scenes')
    .insert({ titre, data, user_id: userData.user.id })
    .select('id, titre, data, updated_at')
    .single();
  if (error) throw error;
  return fromRow(row as SceneRow);
}

export async function deleteScene(id: string): Promise<void> {
  const { error } = await supabase.from('gram3d_scenes').delete().eq('id', id);
  if (error) throw error;
}
