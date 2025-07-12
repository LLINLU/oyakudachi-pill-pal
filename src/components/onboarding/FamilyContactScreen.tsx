import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FamilyContact } from '@/types/onboarding';
import { Plus, Trash2 } from 'lucide-react';
import { MobileAppContainer } from '@/components/MobileAppContainer';

interface FamilyContactScreenProps {
  contacts: FamilyContact[];
  onAddContact: (contact: Omit<FamilyContact, 'id'>) => void;
  onNext: () => void;
}

export const FamilyContactScreen = ({ contacts, onAddContact, onNext }: FamilyContactScreenProps) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');

  const handleAddContact = () => {
    if (name && relationship && email) {
      onAddContact({
        name,
        relationship,
        email,
        preferredMethod: 'email'
      });
      
      // Reset form
      setName('');
      setRelationship('');
      setEmail('');
    }
  };

  const canProceed = contacts.length > 0;

  return (
    <MobileAppContainer>
      <div className="flex items-start justify-center h-full bg-gradient-to-br from-blue-50 to-green-50 p-4 overflow-y-auto">
        <Card className="w-full max-w-sm p-4 space-y-4 animate-fade-in my-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-foreground japanese-text">
              ご家族の連絡先
            </h2>
            <p className="text-sm text-muted-foreground japanese-text">
              通知を送る家族の情報を入力してください
            </p>
          </div>

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
              <Label htmlFor="email" className="japanese-text text-sm">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="h-10"
              />
            </div>

            <Button
              onClick={handleAddContact}
              disabled={!name || !relationship || !email}
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
                登録済みの連絡先
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium japanese-text text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground japanese-text">
                          {contact.relationship} · {contact.email}
                        </p>
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
            className="w-full japanese-text h-12"
          >
            設定完了
          </Button>

          {contacts.length === 0 && (
            <p className="text-xs text-muted-foreground text-center japanese-text">
              少なくとも1人の連絡先を追加してください
            </p>
          )}
        </Card>
      </div>
    </MobileAppContainer>
  );
};