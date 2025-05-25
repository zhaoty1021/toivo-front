// JSON 格式化处理
export const formatJSON = (input) => {
    try {
      if (!input) return ''
      const parsed = typeof input === 'string' ? JSON.parse(input) : input
      return JSON.stringify(parsed, null, 2)
    } catch (e) {
      return `JSON格式化错误: ${e.message}`
    }
  }
  
  // JSON 压缩处理
  export const minifyJSON = (input) => {
    try {
      if (!input) return ''
      const parsed = typeof input === 'string' ? JSON.parse(input) : input
      return JSON.stringify(parsed)
    } catch (e) {
      return `JSON压缩错误: ${e.message}`
    }
  }
  
  // 时间戳转换
  export const convertTimestamp = (timestamp, format = 'datetime') => {
    if (!timestamp) return ''
    
    const date = new Date(Number(timestamp) ? Number(timestamp) : timestamp)
    if (isNaN(date.getTime())) return '无效的时间戳'
    
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    
    return format === 'datetime' 
      ? date.toLocaleString('zh-CN', options)
      : date.toLocaleDateString('zh-CN', options)
  }
  
  // SQL 格式化
  export const formatSQL = (sql) => {
    if (!sql) return ''
    
    // 简单的SQL格式化逻辑
    const formatted = sql
      .replace(/\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP BY|ORDER BY|LIMIT|INSERT INTO|UPDATE|DELETE FROM)\b/gi, '\n$1 ')
      .replace(/,/g, ',\n  ')
      .replace(/$/g, '(\n  ')
      .replace(/$/g, '\n)')
    
    return formatted.trim()
  }
  
  // 获取当前时间戳
  export const getCurrentTimestamp = () => {
    return Date.now()
  }