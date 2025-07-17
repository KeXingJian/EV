// src/api/docApi.js
import axios from 'axios'

// 直接使用代理配置的基础路径
const api = axios.create({
    baseURL: '/api', // 对应vite代理配置的/api
})
