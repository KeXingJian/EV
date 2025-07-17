// src/i18n.js
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'

export const SUPPORTED_LOCALES = ['en', 'zh-CN']

export default createI18n({
    legacy: false, // 使用 Composition API 模式
    locale: 'zh-CN',  // 默认语言
    fallbackLocale: 'en',
    availableLocales: SUPPORTED_LOCALES,
    messages: {
        'en': en,
        'zh-CN': zhCN
    }
})