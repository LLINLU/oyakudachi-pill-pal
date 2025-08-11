import { supabase } from './supabaseClient'

async function testConnection() {
  // 尝试查询 reminder 表
  const { data, error } = await supabase.from('reminder').select('*')
  if (error) {
    console.error('连接失败:', error)
  } else {
    console.log('连接成功，数据如下:', data)
  }
}

testConnection()
