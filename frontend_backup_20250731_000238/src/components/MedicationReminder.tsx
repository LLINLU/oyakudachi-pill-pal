
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Camera, Mic } from 'lucide-react';
import { toast } from 'sonner';

interface Medication {
  id: number;
  name: string;
  englishName: string;
  time: string;
  image: string;
  taken: boolean;
  critical: boolean;
}

interface MedicationReminderProps {
  medications: Medication[];
  onMedicationTaken: (medicationId: number) => void;
  onBack: () => void;
}

const MedicationReminder: React.FC<MedicationReminderProps> = ({
  medications,
  onMedicationTaken,
  onBack
}) => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isListening, setIsListening] = useState(false);

  const pendingMedications = medications.filter(med => !med.taken);
  const completedMedications = medications.filter(med => med.taken);

  const handleVoiceConfirmation = (medication: Medication) => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      toast.success('音声で確認しました', {
        description: `${medication.name}を飲んだことを確認しました`
      });
      onMedicationTaken(medication.id);
    }, 2000);
  };

  const handleCameraVerification = (medication: Medication) => {
    toast.info('カメラで確認中...', {
      description: 'お薬をカメラに向けてください'
    });
    // Simulate camera verification
    setTimeout(() => {
      toast.success('お薬を確認しました', {
        description: '正しいお薬です。服用してください。'
      });
    }, 1500);
  };

  if (selectedMedication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <Button
            onClick={() => setSelectedMedication(null)}
            variant="ghost"
            className="text-gray-600 p-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full shadow-lg"></div>
                {selectedMedication.critical && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2">
                    重要
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-800">
                  {selectedMedication.name}
                </h1>
                <p className="text-lg text-gray-600">
                  {selectedMedication.englishName}
                </p>
                <div className="flex items-center justify-center gap-2 text-lg text-blue-600">
                  <Clock className="h-5 w-5" />
                  {selectedMedication.time}に服用
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => onMedicationTaken(selectedMedication.id)}
                  className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xl font-semibold rounded-2xl"
                >
                  <CheckCircle className="h-8 w-8 mr-3" />
                  飲みました
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleCameraVerification(selectedMedication)}
                    variant="outline"
                    className="h-14 text-lg border-2 border-blue-200 hover:bg-blue-50 rounded-xl"
                  >
                    <Camera className="h-6 w-6 mr-2" />
                    確認
                  </Button>

                  <Button
                    onClick={() => handleVoiceConfirmation(selectedMedication)}
                    variant="outline"
                    className={`h-14 text-lg border-2 rounded-xl ${
                      isListening 
                        ? 'border-red-300 bg-red-50 text-red-600' 
                        : 'border-purple-200 hover:bg-purple-50'
                    }`}
                    disabled={isListening}
                  >
                    <Mic className={`h-6 w-6 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
                    {isListening ? '聞いています...' : '音声'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 p-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">お薬の確認</h1>
        </div>

        {pendingMedications.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                服用が必要なお薬
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingMedications.map(medication => (
                <div
                  key={medication.id}
                  onClick={() => setSelectedMedication(medication)}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                    </div>
                    {medication.critical && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                        重要
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-lg">
                      {medication.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {medication.time}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {medication.englishName}
                    </div>
                  </div>
                  <div className="text-blue-600">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {completedMedications.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                服用済みのお薬
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedMedications.map(medication => (
                <div
                  key={medication.id}
                  className="flex items-center gap-4 p-4 bg-green-50 rounded-xl opacity-75"
                >
                  <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-700 text-lg">
                      {medication.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {medication.time} - 完了
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {pendingMedications.length === 0 && completedMedications.length === 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                素晴らしいです！
              </h3>
              <p className="text-gray-600">
                本日のお薬はすべて服用完了です
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MedicationReminder;
