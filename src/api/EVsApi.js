// src/api/docApi.js
import axios from 'axios'

// 直接使用代理配置的基础路径
const api = axios.create({
    baseURL: '/api', // 对应vite代理配置的/api
    headers: {
        'Content-Type': 'text/plain'
    }
})


export const getTripleData = async (prompt) => {
    try {
        const response = await api.post('/ai/chat', prompt);
        return response.data;
    } catch (error) {
        console.error('API 请求失败:', error);
        throw error;
    }
};
