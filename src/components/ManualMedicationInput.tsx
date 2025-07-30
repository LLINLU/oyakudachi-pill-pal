import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { MedicationInput, MedicationFrequency } from '@/types/medication';

interface ManualMedicationInputProps {
  onBack: () => void;
  onMedicationsAdded: (medications: MedicationInput[]) => void;
}

const FREQUENCY_OPTIONS: MedicationFrequency[] = [
  {
    label: '1日1回',
    times: ['朝'],
    defaultTimes: ['08:00']
  },
  {
    label: '1日2回',
    times: ['朝', '夜'],
    defaultTimes: ['08:00', '20:00']
  },
  {
    label: '1日3回',
    times: ['朝', '昼', '夜'],
    defaultTimes: ['08:00', '12:00', '20:00']
  }
];

const MEAL_TIMING_OPTIONS = [
  {
    label: '時間指定',
    value: 'specific',
    timeSuffix: ''
  },
  {
    label: '食前',
    value: 'before_meals',
    timeSuffix: '食前'
  },
  {
    label: '食後',
    value: 'after_meals', 
    timeSuffix: '食後'
  }
];

const getMealTimingDefaults = (mealTiming: string) => {
  switch (mealTiming) {
    case 'before_meals':
      return ['07:30', '11:30', '18:00'];
    case 'after_meals':
      return ['08:30', '12:30', '19:30'];
    default:
      return ['08:00', '12:00', '20:00'];
  }
};

export const ManualMedicationInput: React.FC<ManualMedicationInputProps> = ({
  onBack,
  onMedicationsAdded
}) => {
  const [medications, setMedications] = useState<MedicationInput[]>([
    { name: '', dosage: '', frequency: '1日1回', mealTiming: 'specific', times: ['08:00'] }
  ]);

  const addMedication = () => {
    setMedications(prev => [...prev, { name: '', dosage: '', frequency: '1日1回', mealTiming: 'specific', times: ['08:00'] }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof MedicationInput, value: string | string[]) => {
    setMedications(prev => 
      prev.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    );
  };

  const updateMedicationFrequency = (index: number, frequency: string) => {
    const selectedFrequency = FREQUENCY_OPTIONS.find(f => f.label === frequency);
    const currentMed = medications[index];
    if (selectedFrequency && currentMed) {
      const defaultTimes = getMealTimingDefaults(currentMed.mealTiming);
      const timesToUse = selectedFrequency.defaultTimes.length <= defaultTimes.length 
        ? selectedFrequency.defaultTimes 
        : defaultTimes.slice(0, selectedFrequency.defaultTimes.length);
      
      setMedications(prev => 
        prev.map((med, i) => 
          i === index ? { 
            ...med, 
            frequency,
            times: [...timesToUse]
          } : med
        )
      );
    }
  };

  const updateMedicationMealTiming = (index: number, mealTiming: string) => {
    const currentMed = medications[index];
    const selectedFrequency = FREQUENCY_OPTIONS.find(f => f.label === currentMed.frequency);
    if (selectedFrequency) {
      const defaultTimes = getMealTimingDefaults(mealTiming);
      const timesToUse = selectedFrequency.defaultTimes.length <= defaultTimes.length 
        ? defaultTimes.slice(0, selectedFrequency.defaultTimes.length)
        : selectedFrequency.defaultTimes;
      
      setMedications(prev => 
        prev.map((med, i) => 
          i === index ? { 
            ...med, 
            mealTiming,
            times: [...timesToUse]
          } : med
        )
      );
    }
  };

  const updateMedicationTime = (index: number, timeIndex: number, time: string) => {
    setMedications(prev => 
      prev.map((med, i) => 
        i === index ? { 
          ...med, 
          times: med.times.map((t, ti) => ti === timeIndex ? time : t)
        } : med
      )
    );
  };

  const handleSubmit = () => {
    const validMedications = medications.filter(med => 
      med.name.trim() && med.times.some(time => time.trim())
    );

    if (validMedications.length === 0) {
      toast.error('少なくとも1つのお薬を入力してください', {
        description: 'お薬名と服用時間は必須項目です'
      });
      return;
    }

    // Validate that all times are filled for each medication
    const invalidMedications = validMedications.filter(med => 
      med.times.some(time => !time.trim())
    );

    if (invalidMedications.length > 0) {
      toast.error('すべての服用時間を入力してください', {
        description: '選択した頻度に応じてすべての時間を設定してください'
      });
      return;
    }

    onMedicationsAdded(validMedications);
    const totalTimes = validMedications.reduce((sum, med) => sum + med.times.length, 0);
    toast.success('お薬を追加しました', {
      description: `${validMedications.length}種類のお薬、${totalTimes}回の服用時間が追加されました`
    });
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">手動でお薬を追加</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {medications.map((medication, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">お薬 {index + 1}</CardTitle>
                {medications.length > 1 && (
                  <Button
                    onClick={() => removeMedication(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>お薬名 *</Label>
                <Input
                  id={`name-${index}`}
                  value={medication.name}
                  onChange={(e) => updateMedication(index, 'name', e.target.value)}
                  placeholder="例: 血圧の薬"
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>服用頻度 *</Label>
                <RadioGroup
                  value={medication.frequency}
                  onValueChange={(value) => updateMedicationFrequency(index, value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {FREQUENCY_OPTIONS.map((option) => (
                    <div key={option.label} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.label} id={`frequency-${index}-${option.label}`} />
                      <Label 
                        htmlFor={`frequency-${index}-${option.label}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>服用タイミング *</Label>
                <RadioGroup
                  value={medication.mealTiming}
                  onValueChange={(value) => updateMedicationMealTiming(index, value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {MEAL_TIMING_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`meal-timing-${index}-${option.value}`} />
                      <Label 
                        htmlFor={`meal-timing-${index}-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  服用時間 *
                </Label>
                <div className="space-y-3">
                  {FREQUENCY_OPTIONS.find(f => f.label === medication.frequency)?.times.map((timeLabel, timeIndex) => {
                    const mealTimingOption = MEAL_TIMING_OPTIONS.find(opt => opt.value === medication.mealTiming);
                    const displayLabel = mealTimingOption?.timeSuffix 
                      ? `${timeLabel}${mealTimingOption.timeSuffix}`
                      : timeLabel;
                    
                    return (
                      <div key={timeIndex} className="flex items-center gap-3">
                        {medication.frequency !== '1日1回' && (
                          <Label className="min-w-[100px] text-sm text-muted-foreground">
                            {displayLabel}
                          </Label>
                        )}
                        <Input
                          type="time"
                          value={medication.times[timeIndex] || ''}
                          onChange={(e) => updateMedicationTime(index, timeIndex, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`dosage-${index}`}>用量・用法</Label>
                <Input
                  id={`dosage-${index}`}
                  value={medication.dosage}
                  onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                  placeholder="例: 1錠"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addMedication}
          variant="outline"
          className="w-full h-12 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          お薬を追加
        </Button>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 border-t">
        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
        >
          お薬を登録する
        </Button>
      </div>
    </div>
  );
};