import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FamilyContact } from '@/types/onboarding';
import { Plus, MessageCircle, QrCode } from 'lucide-react';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface LineContactScreenProps {
  contacts: FamilyContact[];
  onAddContact: (contact: Omit<FamilyContact, 'id'>) => void;
  onNext: () => void;
}

export const LineContactScreen = ({ contacts, onAddContact, onNext }: LineContactScreenProps) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [lineId, setLineId] = useState('');

  const handleAddContact = () => {
    if (name && relationship && lineId) {
      onAddContact({
        name,
        relationship,
        phone: lineId, // Store LINE ID in phone field for now
        preferredMethod: 'sms' // Will represent LINE method
      });
      
      // Reset form
      setName('');
      setRelationship('');
      setLineId('');
    }
  };

  const canProceed = contacts.length > 0;

  return (
    <MobileAppContainer>
      <div className="flex items-start justify-center h-full bg-gradient-to-br from-green-50 to-blue-50 p-4 overflow-y-auto">
        <Card className="w-full max-w-sm p-4 space-y-4 animate-fade-in my-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="w-8 h-8 text-green-600 mr-2" />
              <h2 className="text-lg font-bold text-foreground japanese-text">
                LINE連絡先設定
              </h2>
            </div>
            <p className="text-sm text-muted-foreground japanese-text">
              LINEで通知を受け取る家族の情報を入力してください
            </p>
          </div>

          {/* LINE Bot Setup Instructions */}
          <Card className="p-3 bg-green-50 border-green-200">
            <div className="flex items-start space-x-2">
              <QrCode className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-green-800 japanese-text text-sm">
                  LINEボット設定手順
                </h3>
                <ol className="text-xs text-green-700 japanese-text space-y-1">
                  <li>1. 薬リマインダーボットを友達追加</li>
                  <li>2. 家族にもボットを追加してもらう</li>
                  <li>3. 下記にLINE IDを入力</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Add Contact Form */}
          <Card className="p-3 space-y-3 border-2 border-dashed border-border">
            <div className="space-y-1">
              <Label htmlFor="name" className="japanese-text text-sm">お名前</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 田中 花子"
                className="japanese-text h-10"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="relationship" className="japanese-text text-sm">続柄</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger className="japanese-text h-10">
                  <SelectValue placeholder="続柄を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="娘">娘</SelectItem>
                  <SelectItem value="息子">息子</SelectItem>
                  <SelectItem value="配偶者">配偶者</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="lineId" className="japanese-text text-sm">LINE ID</Label>
              <Input
                id="lineId"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="@username または電話番号"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground japanese-text">
                LINE IDまたは登録電話番号を入力してください
              </p>
            </div>

            <Button
              onClick={handleAddContact}
              disabled={!name || !relationship || !lineId}
              className="w-full japanese-text h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              追加
            </Button>
          </Card>

          {/* Added Contacts */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground japanese-text text-sm">
                登録済みのLINE連絡先
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium japanese-text text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground japanese-text">
                            {contact.relationship} · {contact.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className="w-full japanese-text h-12 bg-green-600 hover:bg-green-700"
          >
            LINE設定完了
          </Button>

          {contacts.length === 0 && (
            <p className="text-xs text-muted-foreground text-center japanese-text">
              少なくとも1人のLINE連絡先を追加してください
            </p>
          )}
        </Card>
      </div>
    </MobileAppContainer>
  );
};