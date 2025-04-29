// src/api/docApi.js
import axios from 'axios'

// 直接使用代理配置的基础路径
const api = axios.create({
    baseURL: '/api', // 对应vite代理配置的/api
})

// 接口1：上传二维表格数据
export const uploadDocuments = (docData) =>
    api.post('/documents', docData) // docData格式示例：[[行1数据], [行2数据], ...]

// 接口2：执行搜索
export const searchDocuments = (column, keyword, fuzzy) =>
    api.get('/search', {
        params: { // 自动转换为URL参数
            column,
            keyword,
            fuzzy
        }
    })

// 接口2：执行搜索
export const searchLine = (column, keyword, fuzzy) =>
    api.get('/linear-search', {
        params: { // 自动转换为URL参数
            column,
            keyword,
            fuzzy
        }
    })