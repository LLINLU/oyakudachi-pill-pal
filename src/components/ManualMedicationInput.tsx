import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MedicationInput {
  name: string;
  time: string;
  dosage: string;
}

interface ManualMedicationInputProps {
  onBack: () => void;
  onMedicationsAdded: (medications: MedicationInput[]) => void;
}

export const ManualMedicationInput: React.FC<ManualMedicationInputProps> = ({
  onBack,
  onMedicationsAdded
}) => {
  const [medications, setMedications] = useState<MedicationInput[]>([
    { name: '', time: '', dosage: '' }
  ]);

  const addMedication = () => {
    setMedications(prev => [...prev, { name: '', time: '', dosage: '' }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof MedicationInput, value: string) => {
    setMedications(prev => 
      prev.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    );
  };

  const handleSubmit = () => {
    const validMedications = medications.filter(med => 
      med.name.trim() && med.time.trim()
    );

    if (validMedications.length === 0) {
      toast.error('少なくとも1つのお薬を入力してください', {
        description: 'お薬名と時間は必須項目です'
      });
      return;
    }

    onMedicationsAdded(validMedications);
    toast.success('お薬を追加しました', {
      description: `${validMedications.length}種類のお薬が追加されました`
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
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor={`time-${index}`}>服用時間 *</Label>
                <Input
                  id={`time-${index}`}
                  type="time"
                  value={medication.time}
                  onChange={(e) => updateMedication(index, 'time', e.target.value)}
                  className="w-full"
                />
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