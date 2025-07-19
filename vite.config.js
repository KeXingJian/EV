import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        obfuscatorPlugin({
            options: {
                debugProtection: true,
                compact: true,                // 压缩代码
                controlFlowFlattening: true,  // 控制流扁平化
                deadCodeInjection: true,      // 注入无用代码
                stringArray: true,            // 字符串数组混淆
                rotateStringArray: true,
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                identifierNamesGenerator: 'hexadecimal' // 变量名十六进制化
            },
        }),
        Sitemap({
            hostname: 'https://tool.excelvision.cloud',
            dynamicRoutes: ['/','modelBuild','beautify']
        }),
    ],
    server: {
        proxy: {
            // 代理规则示例
            '/api': {
                target: 'http://localhost:8080', // 后端接口地址
                changeOrigin: true, // 允许跨域
            }
        }
    }
})
