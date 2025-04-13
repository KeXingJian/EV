import axios from 'axios';
const apiClient = axios.create({
    baseURL: 'http://localhost:5174', // 你的API基础URL
    headers: {
        'Content-Type': 'application/json',
    }
});


export const getData = async () => {
    try {
        const response = await apiClient.get('/api/data/getData');
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
};

export const uploadExcel = async (file, processingMode) => {
    try {
        const formData = new FormData();
        formData.append('excel', file); // 字段名需与后端一致

        const response = await apiClient.post('/api/excel/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 必须设置
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 30000 // 大文件需要更长时间
        });

        return response.data;
    } catch (error) {
        console.error('上传失败:', error.response?.data || error.message);
        throw error; // 抛出错误供调用方处理
    }
};