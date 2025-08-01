
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Medication, ScannedMedication } from '@/types/medication';
import { supabase } from '@/supabaseClient';

export const useMedicationData = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTomorrowSchedule, setShowTomorrowSchedule] = useState(false);

  // 从数据库加载药物数据
  const loadMedicationsFromDB = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reminder')
        .select('*')
        .order('time', { ascending: true });

      if (error) {
        console.error('加载药物数据失败:', error);
        toast.error('データの読み込みに失敗しました');
        return;
      }

      // 转换数据库格式为前端格式
      const convertedMedications: Medication[] = data.map(item => ({
        id: item.id,
        name: item.medication_name || item.name || '薬',
        time: item.time,
        image: item.image || '/lovable-uploads/c00a51fc-e53a-401b-a510-5914fa3c1383.png',
        taken: item.taken || false,
        postponed: item.postponed || false
      }));

      setMedications(convertedMedications);
    } catch (error) {
      console.error('加载药物数据时出错:', error);
      toast.error('データの読み込み中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 保存药物到数据库
  const saveMedicationToDB = async (medication: Omit<Medication, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('reminder')
        .insert([
          {
            medication_name: medication.name,
            time: medication.time,
            image: medication.image,
            taken: medication.taken,
            postponed: medication.postponed,
            user_id: 1 // 默认用户ID，实际应用中应该从认证获取
          }
        ])
        .select();

      if (error) {
        console.error('保存药物数据失败:', error);
        toast.error('データの保存に失敗しました');
        return null;
      }

      return data?.[0];
    } catch (error) {
      console.error('保存药物数据时出错:', error);
      toast.error('データの保存中にエラーが発生しました');
      return null;
    }
  };

  // 更新药物状态到数据库
  const updateMedicationInDB = async (id: number, updates: Partial<Medication>) => {
    try {
      const { error } = await supabase
        .from('reminder')
        .update({
          taken: updates.taken,
          postponed: updates.postponed
        })
        .eq('id', id);

      if (error) {
        console.error('更新药物数据失败:', error);
        toast.error('データの更新に失敗しました');
        return false;
      }

      return true;
    } catch (error) {
      console.error('更新药物数据时出错:', error);
      toast.error('データの更新中にエラーが発生しました');
      return false;
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadMedicationsFromDB();
  }, []);

  const getTomorrowMedications = (): Medication[] => {
    return [
      {
        id: 101,
        name: '血圧の薬',
        time: '08:00',
        image: '/lovable-uploads/c00a51fc-e53a-401b-a510-5914fa3c1383.png',
        taken: false,
        postponed: false
      },
      {
        id: 102,
        name: '糖尿病の薬',
        time: '12:00',
        image: '/lovable-uploads/86c5ab6d-1414-401b-a510-5914fa3c1383.png',
        taken: false,
        postponed: false
      },
      {
        id: 103,
        name: 'ビタミン剤',
        time: '18:00',
        image: '/lovable-uploads/e73d8cf7-4eec-4ace-bd89-ba3a8352b9a4.png',
        taken: false,
        postponed: false
      }
    ];
  };

  const getNextMedication = () => {
    if (showTomorrowSchedule) {
      const tomorrowMeds = getTomorrowMedications();
      return tomorrowMeds.find(med => !med.taken) || null;
    }
    return medications.find(med => !med.taken) || null;
  };

  const areAllMedicationsTaken = () => {
    return medications.every(med => med.taken);
  };

  const markMedicationTaken = async (medicationId: number) => {
    // 先更新本地状态
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, taken: true }
          : med
      )
    );

    // 然后更新数据库
    const success = await updateMedicationInDB(medicationId, { taken: true });
    if (success) {
      toast.success('服薬を記録しました');
    }
  };

  const markMedicationPostponed = async (medicationId: number) => {
    // 先更新本地状态
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, postponed: true }
          : med
      )
    );

    // 然后更新数据库
    const success = await updateMedicationInDB(medicationId, { postponed: true });
    if (success) {
      toast.success('服薬を延期しました');
    }
  };

  const addScannedMedications = async (scannedMeds: ScannedMedication[]) => {
    const newMedications: Medication[] = [];
    
    for (const scanned of scannedMeds) {
      const medicationData = {
        name: `${scanned.name} (${scanned.dosage})`,
        time: scanned.time.split(',')[0],
        image: '/lovable-uploads/c00a51fc-e53a-401b-a510-5914fa3c1383.png',
        taken: false,
        postponed: false
      };

      // 保存到数据库
      const savedMedication = await saveMedicationToDB(medicationData);
      if (savedMedication) {
        newMedications.push({
          id: savedMedication.id,
          ...medicationData
        });
      }
    }

    // 更新本地状态
    setMedications(prev => [...prev, ...newMedications]);
    
    if (newMedications.length > 0) {
      toast.success('薬手帳から追加しました', {
        description: `${newMedications.length}種類のお薬が追加されました`,
        duration: 4000
      });
    }
  };

  const switchToTomorrowSchedule = () => {
    setShowTomorrowSchedule(true);
  };

  const addManualMedications = async (manualMeds: { name: string; dosage: string; frequency: string; mealTiming: string; times: string[] }[]) => {
    const newMedications: Medication[] = [];
    
    for (const med of manualMeds) {
      // 为每个时间创建单独的药物条目
      for (const time of med.times) {
        const medicationData = {
          name: med.dosage ? `${med.name} (${med.dosage})` : med.name,
          time: time,
          image: '/lovable-uploads/c00a51fc-e53a-401b-a510-5914fa3c1383.png',
          taken: false,
          postponed: false
        };

        // 保存到数据库
        const savedMedication = await saveMedicationToDB(medicationData);
        if (savedMedication) {
          newMedications.push({
            id: savedMedication.id,
            ...medicationData
          });
        }
      }
    }

    // 更新本地状态
    setMedications(prev => [...prev, ...newMedications]);
    
    if (newMedications.length > 0) {
      const totalEntries = newMedications.length;
      toast.success('お薬を追加しました', {
        description: `${manualMeds.length}種類のお薬、${totalEntries}回の服用時間が追加されました`,
        duration: 4000
      });
    }
  };

  const hasNoMedications = () => {
    return medications.length === 0;
  };

  return {
    medications,
    loading,
    getNextMedication,
    areAllMedicationsTaken,
    markMedicationTaken,
    markMedicationPostponed,
    addScannedMedications,
    switchToTomorrowSchedule,
    addManualMedications,
    hasNoMedications,
    showTomorrowSchedule,
    loadMedicationsFromDB
  };
};
