export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'HSCode编码查询-首页',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: '外贸、跨境、海关编码、查询、hscode查询、hscode编码、搜索' },
      { hid: 'description', name: 'description', content: '最全面、方便、准确的外贸、跨境、海关编码查询、hscode查询' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/hscode.png' },
      { rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css' },
      { rel: 'stylesheet', href: 'https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css' }
    ],
    script: [
      { src: 'https://cdn.staticfile.org/vue/2.5.22/vue.min.js' },
      { src: 'https://unpkg.com/element-ui/lib/index.js' },
      { src: 'https://cdn.staticfile.org/axios/0.18.0/axios.min.js' },
      { src: 'https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/css/global.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/axios', ssr: true },
    { src: '@/plugins/element-ui', ssr: true }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  //配置发布模式不打包项，使用CDN加载
  build: {
    extend(config, { isDev, isClient }) {
      if (isClient) {
        config.externals = {
          vue: 'Vue',
          axios: 'axios',
          nprogress: 'NProgress',
          'element-ui': 'element-ui'
        }
      }
    }
  }
}
