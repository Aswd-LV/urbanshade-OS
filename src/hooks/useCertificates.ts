// UrbanShade OS v3.1 - Certificates Hook
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Certificate {
  id: string;
  user_id: string;
  certificate_type: 'battlepass' | 'achievement';
  certificate_id: string;
  certificate_name: string;
  season_key?: string;
  achievement_rarity?: string;
  earned_at: string;
}

export const useCertificates = (userId?: string) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_certificates')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setCertificates((data || []) as Certificate[]);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Award a certificate
  const awardCertificate = useCallback(async (
    type: 'battlepass' | 'achievement',
    certificateId: string,
    name: string,
    seasonKey?: string,
    rarity?: string
  ): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_certificates')
        .insert({
          user_id: userId,
          certificate_type: type,
          certificate_id: certificateId,
          certificate_name: name,
          season_key: seasonKey,
          achievement_rarity: rarity,
        });

      if (error) {
        if (error.code === '23505') return true; // Already has it
        throw error;
      }

      // Refetch
      await fetchCertificates();
      return true;
    } catch (err) {
      console.error('Failed to award certificate:', err);
      return false;
    }
  }, [userId, fetchCertificates]);

  // Check if has a specific certificate
  const hasCertificate = useCallback((type: string, certificateId: string): boolean => {
    return certificates.some(c => c.certificate_type === type && c.certificate_id === certificateId);
  }, [certificates]);

  // Get Battle Pass certificates
  const getBattlePassCertificates = useCallback((): Certificate[] => {
    return certificates.filter(c => c.certificate_type === 'battlepass');
  }, [certificates]);

  // Get Achievement certificates (Epic/Legendary only)
  const getAchievementCertificates = useCallback((): Certificate[] => {
    return certificates.filter(c => c.certificate_type === 'achievement');
  }, [certificates]);

  return {
    certificates,
    loading,
    awardCertificate,
    hasCertificate,
    getBattlePassCertificates,
    getAchievementCertificates,
    refetch: fetchCertificates,
  };
};
