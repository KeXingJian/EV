// src/api/docApi.js
import axios from 'axios'

// 直接使用代理配置的基础路径
const api = axios.create({
    baseURL: '/api', // 对应vite代理配置的/api
    headers: {
        'Content-Type': 'text/plain'
    }
})



// 响应拦截器
api.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response;
    },
    error => {
        // 检查是否是429限流错误
        if (error.response && error.response.status === 429) {
            console.error('接口调用已达上限，请明日再试');

            // 显示用户友好的提示（根据您的UI框架调整）
            alert('今日服务调用已至上限，明日再试或联系作者');

            // 返回一个自定义的Promise，让调用方知道是限流问题
            return Promise.reject({
                ...error,
                isRateLimit: true,
                message: '接口调用已达上限，请明日再试'
            });
        }

        // 其他错误继续抛出
        return Promise.reject(error);
    }
);



export const test = async (prompt) => {
    try {
        const response = await api.get('/ai/test', prompt);
        return response.data;
    } catch (error) {
        console.error('API 请求失败:', error);
        throw error;
    }
}


export const getTripleData = async (prompt) => {
    try {
        const response = await api.post('/ai/getTripleData', prompt);
        return response.data;
    } catch (error) {
        console.error('API 请求失败:', error);
        throw error;
    }
}

// 新增文件上传API
export const getTripleDataByFile = async (file,prompt) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (prompt) formData.append('prompt', prompt);

        // 注意：这里使用不同的Content-Type
        const response = await api.post('/ai/getTripleDataByText', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
}


export const getStructuredData = async (prompt) => {
    try {
        const response = await api.post('/ai/getStructuredData', prompt);
        return response.data;
    } catch (error) {
        console.error('API 请求失败:', error);
        throw error;
    }
}

// 新增文件上传API
export const getStructuredDataByText = async (file,prompt) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (prompt) formData.append('prompt', prompt);

        // 注意：这里使用不同的Content-Type
        const response = await api.post('/ai/getStructuredDataByText', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
}

