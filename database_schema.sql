-- FamMed MVP 数据库表结构
-- 基于前端界面定义和用户流程设计
-- 支持完整的端到端用户流程：从应用启动到首次家庭通知

-- ========================================
-- 1. 用户管理表
-- ========================================

-- 主用户表（老年人用户）
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    line_user_id VARCHAR(100) UNIQUE, -- LINE登录用户ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    language VARCHAR(10) DEFAULT 'ja' CHECK (language IN ('ja', 'en')),
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    notification_enabled BOOLEAN DEFAULT true,
    camera_permission BOOLEAN DEFAULT false,
    notification_permission BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    family_notification_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- 用户设置表
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reminder_sound_enabled BOOLEAN DEFAULT true,
    voice_reminder_enabled BOOLEAN DEFAULT true,
    vibration_enabled BOOLEAN DEFAULT true,
    reminder_advance_minutes INTEGER DEFAULT 15,
    auto_postpone_enabled BOOLEAN DEFAULT false,
    auto_postpone_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ========================================
-- 2. 家庭联系人管理表
-- ========================================

-- 家庭联系人表
CREATE TABLE family_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL, -- 女儿、儿子等
    contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('line', 'email', 'both')),
    line_user_id VARCHAR(100), -- LINE用户ID
    email VARCHAR(255),
    phone VARCHAR(20),
    notification_enabled BOOLEAN DEFAULT true,
    notification_methods TEXT[] DEFAULT ARRAY['line', 'email'], -- 通知方式
    is_primary_contact BOOLEAN DEFAULT false, -- 主要联系人
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LINE集成表
CREATE TABLE line_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    line_user_id VARCHAR(100) NOT NULL,
    line_access_token TEXT,
    line_refresh_token TEXT,
    line_friends_list JSONB, -- 存储LINE好友列表
    integration_status VARCHAR(20) DEFAULT 'pending' CHECK (integration_status IN ('pending', 'active', 'failed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, line_user_id)
);

-- ========================================
-- 3. 药物管理表
-- ========================================

-- 药物主表
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- 药物名称
    generic_name VARCHAR(255), -- 通用名称
    dosage_form VARCHAR(100), -- 剂型（片剂、胶囊等）
    strength VARCHAR(100), -- 剂量强度
    strength_unit VARCHAR(50), -- 剂量单位
    instructions TEXT, -- 服用说明
    prescribing_doctor VARCHAR(255), -- 处方医生
    pharmacy VARCHAR(255), -- 药房
    prescription_date DATE, -- 处方日期
    start_date DATE NOT NULL, -- 开始服用日期
    end_date DATE, -- 结束服用日期
    total_quantity INTEGER, -- 总数量
    remaining_quantity INTEGER, -- 剩余数量
    medication_image_url TEXT, -- 药物照片URL
    prescription_image_url TEXT, -- 处方照片URL
    ocr_data JSONB, -- OCR识别的原始数据
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 药物服用时间表
CREATE TABLE medication_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    time_of_day TIME NOT NULL, -- 服用时间（如08:00）
    frequency_type VARCHAR(20) NOT NULL CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'custom')),
    frequency_value INTEGER DEFAULT 1, -- 频率值
    frequency_unit VARCHAR(20) DEFAULT 'day', -- 频率单位
    days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 每周几服用（1=周一）
    specific_dates DATE[], -- 特定日期服用
    meal_relation VARCHAR(20) CHECK (meal_relation IN ('before_breakfast', 'after_breakfast', 'before_lunch', 'after_lunch', 'before_dinner', 'after_dinner', 'empty_stomach', 'anytime')),
    instructions TEXT, -- 具体服用说明
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 药物服用记录表
CREATE TABLE medication_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES medication_schedules(id),
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL, -- 计划服用时间
    actual_time TIMESTAMP WITH TIME ZONE, -- 实际服用时间
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'skipped', 'postponed', 'missed')),
    quantity_taken INTEGER DEFAULT 1, -- 实际服用数量
    notes TEXT, -- 备注
    location_lat DECIMAL(10, 8), -- 服用位置纬度
    location_lng DECIMAL(11, 8), -- 服用位置经度
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. 提醒和通知表
-- ========================================

-- 提醒主表
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES medication_schedules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_type VARCHAR(20) DEFAULT 'medication' CHECK (reminder_type IN ('medication', 'refill', 'appointment', 'custom')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'cancelled', 'expired')),
    notification_sent BOOLEAN DEFAULT false,
    family_notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 通知发送记录表
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES family_contacts(id) ON DELETE CASCADE,
    notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('push', 'line', 'email', 'sms')),
    title VARCHAR(255),
    message TEXT NOT NULL,
    recipient VARCHAR(255) NOT NULL, -- 接收者标识
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. OCR和图像处理表
-- ========================================

-- OCR处理记录表
CREATE TABLE ocr_processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) NOT NULL CHECK (image_type IN ('prescription', 'medication', 'other')),
    ocr_service VARCHAR(50) DEFAULT 'google_vision', -- OCR服务提供商
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    raw_ocr_result JSONB, -- 原始OCR结果
    processed_data JSONB, -- 处理后的结构化数据
    confidence_score DECIMAL(3,2), -- 置信度分数
    processing_time_ms INTEGER, -- 处理时间（毫秒）
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 图像存储表
CREATE TABLE image_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    image_type VARCHAR(20) NOT NULL CHECK (image_type IN ('prescription', 'medication', 'profile', 'other')),
    storage_provider VARCHAR(50) DEFAULT 'local', -- 存储提供商
    url TEXT, -- 访问URL
    metadata JSONB, -- 图像元数据
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. 应用使用统计表
-- ========================================

-- 用户活动日志表
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 活动类型
    activity_details JSONB, -- 活动详情
    screen_name VARCHAR(100), -- 屏幕名称
    session_id VARCHAR(100), -- 会话ID
    device_info JSONB, -- 设备信息
    location_info JSONB, -- 位置信息
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 药物依从性统计表
CREATE TABLE medication_adherence_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_scheduled INTEGER DEFAULT 0, -- 计划服用次数
    total_taken INTEGER DEFAULT 0, -- 实际服用次数
    total_skipped INTEGER DEFAULT 0, -- 跳过次数
    total_postponed INTEGER DEFAULT 0, -- 推迟次数
    adherence_rate DECIMAL(5,2), -- 依从率
    on_time_count INTEGER DEFAULT 0, -- 按时服用次数
    late_count INTEGER DEFAULT 0, -- 延迟服用次数
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, medication_id, date)
);

-- ========================================
-- 7. 系统配置表
-- ========================================

-- 系统配置表
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(20) DEFAULT 'string' CHECK (config_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 通知模板表
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(100) UNIQUE NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 模板类型
    language VARCHAR(10) DEFAULT 'ja',
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    variables JSONB, -- 模板变量
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. 索引创建
-- ========================================

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_line_user_id ON users(line_user_id);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 家庭联系人索引
CREATE INDEX idx_family_contacts_user_id ON family_contacts(user_id);
CREATE INDEX idx_family_contacts_line_user_id ON family_contacts(line_user_id);
CREATE INDEX idx_family_contacts_email ON family_contacts(email);

-- 药物表索引
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medications_start_date ON medications(start_date);
CREATE INDEX idx_medications_end_date ON medications(end_date);

-- 药物时间表索引
CREATE INDEX idx_medication_schedules_medication_id ON medication_schedules(medication_id);
CREATE INDEX idx_medication_schedules_time_of_day ON medication_schedules(time_of_day);
CREATE INDEX idx_medication_schedules_is_active ON medication_schedules(is_active);

-- 药物记录索引
CREATE INDEX idx_medication_records_medication_id ON medication_records(medication_id);
CREATE INDEX idx_medication_records_scheduled_time ON medication_records(scheduled_time);
CREATE INDEX idx_medication_records_status ON medication_records(status);
-- 注意：medication_records 表没有 user_id 列，通过 medication_id 间接关联

-- 提醒表索引
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_scheduled_time ON reminders(scheduled_time);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_medication_id ON reminders(medication_id);

-- 通知日志索引
CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_notification_logs_reminder_id ON notification_logs(reminder_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);

-- OCR处理日志索引
CREATE INDEX idx_ocr_processing_logs_user_id ON ocr_processing_logs(user_id);
CREATE INDEX idx_ocr_processing_logs_status ON ocr_processing_logs(processing_status);
CREATE INDEX idx_ocr_processing_logs_created_at ON ocr_processing_logs(created_at);

-- 图像存储索引
CREATE INDEX idx_image_storage_user_id ON image_storage(user_id);
CREATE INDEX idx_image_storage_image_type ON image_storage(image_type);
CREATE INDEX idx_image_storage_created_at ON image_storage(created_at);

-- 用户活动日志索引
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_activity_type ON user_activity_logs(activity_type);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- 药物依从性统计索引
CREATE INDEX idx_medication_adherence_stats_user_id ON medication_adherence_stats(user_id);
CREATE INDEX idx_medication_adherence_stats_date ON medication_adherence_stats(date);
CREATE INDEX idx_medication_adherence_stats_medication_id ON medication_adherence_stats(medication_id);

-- ========================================
-- 9. 触发器函数
-- ========================================

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要自动更新时间的表添加触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_family_contacts_updated_at BEFORE UPDATE ON family_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_line_integrations_updated_at BEFORE UPDATE ON line_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medication_schedules_updated_at BEFORE UPDATE ON medication_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medication_records_updated_at BEFORE UPDATE ON medication_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ocr_processing_logs_updated_at BEFORE UPDATE ON ocr_processing_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medication_adherence_stats_updated_at BEFORE UPDATE ON medication_adherence_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_configs_updated_at BEFORE UPDATE ON system_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 10. 初始数据插入
-- ========================================

-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, config_type, description) VALUES
('app_name', 'FamMed', 'string', '应用名称'),
('app_version', '1.0.0', 'string', '应用版本'),
('max_family_contacts', '5', 'number', '最大家庭联系人数量'),
('default_reminder_advance_minutes', '15', 'number', '默认提醒提前时间（分钟）'),
('ocr_confidence_threshold', '0.7', 'number', 'OCR置信度阈值'),
('max_medication_image_size_mb', '10', 'number', '最大药物图像大小（MB）'),
('notification_retry_attempts', '3', 'number', '通知重试次数'),
('session_timeout_minutes', '30', 'number', '会话超时时间（分钟）');

-- 插入通知模板
INSERT INTO notification_templates (template_name, template_type, language, title_template, body_template, variables) VALUES
('medication_reminder', 'push', 'ja', 'FamMed - お薬の時間です', '{{medication_name}} {{dosage_instructions}}', '{"medication_name": "药物名称", "dosage_instructions": "服用说明"}'),
('medication_taken_family', 'line', 'ja', '🏥 FamMed お薬通知', 'お父様がお薬を服用されました\n💊 {{medication_name}}\n🕘 時刻: {{time}}\n✅ 状態: 服用完了\n本日の服薬状況: {{daily_progress}}', '{"medication_name": "药物名称", "time": "服用时间", "daily_progress": "当日进度"}'),
('medication_taken_family_email', 'email', 'ja', 'FamMed通知: {{family_member}}の服薬確認 - {{date}}', '<h3>🏥 {{family_member}}の服薬通知</h3><div style="background:#f8f9fa;padding:20px;border-radius:8px;"><h4>💊 {{medication_name}}</h4><p><strong>服用時刻:</strong> {{time}}</p><p><strong>状態:</strong> ✅ 服用完了</p><p><strong>本日の進捗:</strong> {{daily_progress}}</p></div>', '{"family_member": "家庭成员", "medication_name": "药物名称", "time": "服用时间", "date": "日期", "daily_progress": "当日进度"}');

-- ========================================
-- 11. 视图创建
-- ========================================

-- 用户药物概览视图
CREATE VIEW user_medication_overview AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    COUNT(m.id) as total_medications,
    COUNT(CASE WHEN m.status = 'active' THEN 1 END) as active_medications,
    COUNT(CASE WHEN m.status = 'completed' THEN 1 END) as completed_medications,
    u.family_notification_enabled,
    u.onboarding_completed
FROM users u
LEFT JOIN medications m ON u.id = m.user_id
GROUP BY u.id, u.first_name, u.last_name, u.family_notification_enabled, u.onboarding_completed;

-- 今日药物提醒视图
CREATE VIEW today_medication_reminders AS
SELECT 
    r.id as reminder_id,
    r.user_id,
    u.first_name,
    u.last_name,
    m.name as medication_name,
    m.medication_image_url,
    r.title,
    r.message,
    r.scheduled_time,
    r.status,
    ms.meal_relation,
    ms.instructions as dosage_instructions
FROM reminders r
JOIN users u ON r.user_id = u.id
JOIN medications m ON r.medication_id = m.id
JOIN medication_schedules ms ON r.schedule_id = ms.id
WHERE DATE(r.scheduled_time) = CURRENT_DATE
AND r.status IN ('pending', 'sent')
ORDER BY r.scheduled_time;

-- 家庭通知状态视图
CREATE VIEW family_notification_status AS
SELECT 
    fc.id as contact_id,
    fc.user_id,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    fc.name as contact_name,
    fc.relationship,
    fc.contact_type,
    fc.notification_enabled,
    fc.notification_methods,
    COUNT(nl.id) as total_notifications,
    COUNT(CASE WHEN nl.status = 'delivered' THEN 1 END) as delivered_notifications,
    COUNT(CASE WHEN nl.status = 'read' THEN 1 END) as read_notifications
FROM family_contacts fc
JOIN users u ON fc.user_id = u.id
LEFT JOIN notification_logs nl ON fc.id = nl.contact_id
GROUP BY fc.id, fc.user_id, u.first_name, u.last_name, fc.name, fc.relationship, fc.contact_type, fc.notification_enabled, fc.notification_methods;

-- ========================================
-- 12. 权限设置 (Supabase兼容版本)
-- ========================================

-- 注意：在Supabase中，角色创建和权限设置可能受限
-- 建议在Supabase Dashboard中手动设置权限，或使用RLS (Row Level Security)

-- 启用RLS (Row Level Security) 用于数据安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_adherence_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- 创建基本的RLS策略（示例）
-- 用户只能访问自己的数据
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 家庭联系人策略
CREATE POLICY "Users can manage own family contacts" ON family_contacts
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 药物相关策略
CREATE POLICY "Users can manage own medications" ON medications
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own medication schedules" ON medication_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM medications m 
            WHERE m.id = medication_schedules.medication_id 
            AND m.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage own medication records" ON medication_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM medications m 
            WHERE m.id = medication_records.medication_id 
            AND m.user_id::text = auth.uid()::text
        )
    );

-- 提醒策略
CREATE POLICY "Users can manage own reminders" ON reminders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM medications m 
            WHERE m.id = reminders.medication_id 
            AND m.user_id::text = auth.uid()::text
        )
    );

-- 通知日志策略
CREATE POLICY "Users can view own notification logs" ON notification_logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- 图像存储策略
CREATE POLICY "Users can manage own images" ON image_storage
    FOR ALL USING (auth.uid()::text = user_id::text);

-- OCR处理日志策略
CREATE POLICY "Users can view own OCR logs" ON ocr_processing_logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- 用户活动日志策略
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- 药物依从性统计策略
CREATE POLICY "Users can view own adherence stats" ON medication_adherence_stats
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- 系统配置策略（只读，所有用户可访问）
CREATE POLICY "All users can view system configs" ON system_configs
    FOR SELECT USING (true);

-- 通知模板策略（只读，所有用户可访问）
CREATE POLICY "All users can view notification templates" ON notification_templates
    FOR SELECT USING (true);

-- 注释说明
COMMENT ON TABLE users IS '主用户表，存储老年人用户的基本信息';
COMMENT ON TABLE family_contacts IS '家庭联系人表，存储需要通知的家庭成员信息';
COMMENT ON TABLE medications IS '药物主表，存储用户的所有药物信息';
COMMENT ON TABLE medication_schedules IS '药物服用时间表，定义每种药物的服用计划';
COMMENT ON TABLE medication_records IS '药物服用记录表，记录每次服用的实际情况';
COMMENT ON TABLE reminders IS '提醒主表，管理所有药物提醒';
COMMENT ON TABLE notification_logs IS '通知发送记录表，跟踪所有通知的发送状态';
COMMENT ON TABLE ocr_processing_logs IS 'OCR处理记录表，记录处方识别过程';
COMMENT ON TABLE image_storage IS '图像存储表，管理所有上传的图像文件';

-- 完成
SELECT 'FamMed MVP 数据库表结构创建完成！' as status;
