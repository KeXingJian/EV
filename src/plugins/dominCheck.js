const DOMAIN_WHITELIST = JSON.parse('["localhost", "tool.excelvision.cloud"]')

export const DomainCheckPlugin = {
    install(app) {
        const checkDomain = () => {
            const currentHost = window.location.hostname
            if (!DOMAIN_WHITELIST.includes(currentHost)) {
                // 非法域名处理
                document.body.innerHTML = '<h1>非法访问！</h1>'
                if (import.meta.env.PROD) {
                    window.location.href = 'https://yourdomain.com' // 生产环境跳转
                }
                throw new Error('Domain not allowed')
            }
        }

        // 首次加载检查
        checkDomain()
        // 路由变化检查（如果使用Vue Router）
        if (app.config.globalProperties.$router) {
            app.config.globalProperties.$router.afterEach(checkDomain)
        }
    }
}