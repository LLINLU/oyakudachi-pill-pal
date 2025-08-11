import { supabase } from './supabaseClient';

// 测试数据库连接和数据写入
async function testDatabaseOperations() {
  console.log('🧪 开始测试数据库操作...');

  try {
    // 1. 测试连接
    console.log('1. 测试数据库连接...');
    const { data: testData, error: testError } = await supabase
      .from('reminder')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ 数据库连接失败:', testError);
      return;
    }
    console.log('✅ 数据库连接成功');

    // 2. 测试插入数据
    console.log('2. 测试插入数据...');
    const testMedication = {
      medication_name: 'テスト薬',
      time: '10:00',
      image: '/test-image.png',
      taken: false,
      postponed: false,
      user_id: 1
    };

    const { data: insertData, error: insertError } = await supabase
      .from('reminder')
      .insert([testMedication])
      .select();

    if (insertError) {
      console.error('❌ 数据插入失败:', insertError);
      return;
    }
    console.log('✅ 数据插入成功:', insertData);

    // 3. 测试查询数据
    console.log('3. 测试查询数据...');
    const { data: queryData, error: queryError } = await supabase
      .from('reminder')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (queryError) {
      console.error('❌ 数据查询失败:', queryError);
      return;
    }
    console.log('✅ 数据查询成功:', queryData);

    // 4. 测试更新数据
    if (insertData && insertData.length > 0) {
      console.log('4. 测试更新数据...');
      const { error: updateError } = await supabase
        .from('reminder')
        .update({ taken: true })
        .eq('id', insertData[0].id);

      if (updateError) {
        console.error('❌ 数据更新失败:', updateError);
        return;
      }
      console.log('✅ 数据更新成功');
    }

    // 5. 清理测试数据
    console.log('5. 清理测试数据...');
    const { error: deleteError } = await supabase
      .from('reminder')
      .delete()
      .eq('medication_name', 'テスト薬');

    if (deleteError) {
      console.error('❌ 数据删除失败:', deleteError);
      return;
    }
    console.log('✅ 测试数据清理成功');

    console.log('🎉 所有数据库操作测试通过！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testDatabaseOperations(); 