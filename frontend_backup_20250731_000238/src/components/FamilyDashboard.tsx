
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, CheckCircle, AlertTriangle, Phone, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import axios from "axios";

interface FamilyDashboardProps {
  onBack: () => void;
}

function InviteCodeGenerator({ ownerUserId }) {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  const handleGenerate = async () => {
    try {
      const res = await axios.post("/api/invite/generate", { owner_user_id: ownerUserId });
      setInviteCode(res.data.code);
      setInviteUrl(`${window.location.origin}/invite/${res.data.code}`);
    } catch (e) {
      alert("生成邀请码失败");
    }
  };

  return (
    <div>
      <button onClick={handleGenerate}>生成邀请链接</button>
      {inviteCode && (
        <div style={{ marginTop: 12 }}>
          邀请链接：<br />
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer">{inviteUrl}</a>
        </div>
      )}
    </div>
  );
}

const FamilyDashboard: React.FC<FamilyDashboardProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const familyMembers = [
    {
      id: 1,
      name: '田中 花子',
      relationship: '娘',
      avatar: '👩',
      lastSeen: '2分前',
      notificationLevel: 'all'
    },
    {
      id: 2,
      name: '田中 太郎',
      relationship: '息子',
      avatar: '👨',
      lastSeen: '1時間前',
      notificationLevel: 'important'
    },
    {
      id: 3,
      name: '田中 美咲',
      relationship: '孫',
      avatar: '👧',
      lastSeen: '1日前',
      notificationLevel: 'none'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      time: '08:00',
      action: '朝の血圧薬を服用',
      status: 'completed',
      family_notified: true
    },
    {
      id: 2,
      time: '12:00',
      action: '昼の糖尿病薬を服用',
      status: 'completed',
      family_notified: true
    },
    {
      id: 3,
      time: '18:00',
      action: '夕方の薬を確認中',
      status: 'pending',
      family_notified: false
    }
  ];

  const adherenceData = {
    week: { rate: 95, trend: '+2%' },
    month: { rate: 92, trend: '+5%' },
    year: { rate: 89, trend: '+8%' }
  };

  const messagesFamilySent = [
    {
      id: 1,
      from: '花子',
      message: 'お薬きちんと飲めていて安心です！',
      time: '10分前',
      type: 'encouragement'
    },
    {
      id: 2,
      from: '太郎',
      message: '血圧薬の効果はいかがですか？',
      time: '2時間前',
      type: 'question'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 p-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">ご家族との連携</h1>
        </div>

        <Tabs defaultValue="family" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="family" className="text-sm">家族</TabsTrigger>
            <TabsTrigger value="status" className="text-sm">状況</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">メッセージ</TabsTrigger>
          </TabsList>

          <TabsContent value="family" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  見守りをしてくれる家族
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {familyMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-3xl">{member.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-lg">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.relationship} • {member.lastSeen}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Badge 
                        variant={
                          member.notificationLevel === 'all' ? 'default' :
                          member.notificationLevel === 'important' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {member.notificationLevel === 'all' ? '全通知' :
                         member.notificationLevel === 'important' ? '重要のみ' : '通知なし'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 邀请码生成入口 */}
            <div className="py-4">
              <InviteCodeGenerator ownerUserId={1} />
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      ご家族は安心しています
                    </h3>
                    <p className="text-gray-600 text-sm">
                      お薬をきちんと飲んでいるため、ご家族に安心感を与えています
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  服薬状況
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(adherenceData).map(([period, data]) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        selectedPeriod === period
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {data.rate}%
                      </div>
                      <div className="text-xs text-gray-600">
                        {period === 'week' ? '今週' : period === 'month' ? '今月' : '今年'}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {data.trend}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-800 font-medium mb-2">
                    今日の服薬記録
                  </div>
                  <div className="space-y-2">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-800">
                            {activity.time}
                          </div>
                          <div className="text-sm text-gray-600">
                            {activity.action}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {activity.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                          {activity.family_notified && (
                            <Badge variant="outline" className="text-xs">
                              家族通知済
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  家族からのメッセージ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {messagesFamilySent.map(message => (
                  <div key={message.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-800">
                        {message.from}さんから
                      </div>
                      <div className="text-xs text-gray-500">
                        {message.time}
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2">
                      {message.message}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        返信
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        👍
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="text-center py-4">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    家族にメッセージを送る
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FamilyDashboard;
