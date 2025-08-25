import { defineConfig } from 'vitepress'
import vitepressProtectPlugin from "vitepress-protect-plugin"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LayRain",
  description: "LayRain",
  vite: {
    plugins: [
      vitepressProtectPlugin({
        disableF12: true, // 禁用F12开发者模式
        disableCopy: true, // 禁用文本复制
        disableSelect: true, // 禁用文本选择
      }),
    ],
  },
  markdown: {
      config: (md) => {
        // 代码组中添加图片
        md.use((md) => {
          const defaultRender = md.render
          md.render = (...args) => {
            const [content, env] = args
            const currentLang = env?.localeIndex || 'root'
            const isHomePage = env?.path === '/' || env?.relativePath === 'index.md'  // 判断是否是首页

            if (isHomePage) {
              return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
            }
            // 调用原始渲染
            let defaultContent = defaultRender.apply(md, args)
            // 替换内容
            if (currentLang === 'root') {
              defaultContent = defaultContent.replace(/提醒/g, '提醒')
                .replace(/建议/g, '建议')
                .replace(/重要/g, '重要')
                .replace(/警告/g, '警告')
                .replace(/注意/g, '注意')
            } else if (currentLang === 'ko') {
              // 韩文替换
              defaultContent = defaultContent.replace(/提醒/g, '알림')
                .replace(/建议/g, '팁')
                .replace(/重要/g, '중요')
                .replace(/警告/g, '경고')
                .replace(/注意/g, '주의')
            }
            // 返回渲染的内容
            return defaultContent
          }

          // 获取原始的 fence 渲染规则
          const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content);

          // 重写 fence 渲染规则
          md.renderer.rules.fence = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const info = token.info.trim();

            // 判断是否为 md:img 类型的代码块
            if (info.includes('md:img')) {
              // 只渲染图片，不再渲染为代码块
              return `<div class="rendered-md">${md.render(token.content)}</div>`;
            }

            // 其他代码块按默认规则渲染（如 java, js 等）
            return defaultFence(tokens, idx, options, env, self);
          };
        })
      }
    },
  themeConfig: {
    logo: 'https://layrain.cynara.my/assist/img/logo.svg',
    //编辑本页
    editLink: { 
      pattern: 'https://github.com/CynaraGroup/LayRain/edit/master/docs/docs/:path', // 改成自己的仓库
      text: '在GitHub编辑本页'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '语句接口', link: '/sentence' },
      { text: '雷语相关', items:[
          { text: '主站', link: 'https://layrain.cynara.my'},
          { text: 'Cynara', link: 'https://www.cynara.my' },
          { text: 'QQ群', link: 'https://qm.qq.com/q/hmhimw0dpY' },
        ]
      },
    ],

    sidebar: [
      {
        text: '序',
        items: [
          { text: '主页', link: '/' },
          { text: '介绍', link: '/introduce' }
        ]
      },
      {
        text: '语句接口',
        items: [
          { text: '语句接口', link: '/sentence' },
          { text: '使用示例', link: '/demo' },
          { text: '部署实例', link: '/deploy' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CynaraGroup' },
      {
        icon: {
          svg: '<svg t="1755515357063" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4940" width="200" height="200"><path d="M926.47619 355.644952V780.190476a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V355.644952l304.103619 257.828572a170.666667 170.666667 0 0 0 220.745142 0L926.47619 355.644952zM853.333333 170.666667a74.044952 74.044952 0 0 1 26.087619 4.778666 72.704 72.704 0 0 1 30.622477 22.186667 73.508571 73.508571 0 0 1 10.678857 17.67619c3.169524 7.509333 5.12 15.652571 5.607619 24.210286L926.47619 243.809524v24.380952L559.469714 581.241905a73.142857 73.142857 0 0 1-91.306666 2.901333l-3.632762-2.925714L97.52381 268.190476v-24.380952a72.899048 72.899048 0 0 1 40.155428-65.292191A72.97219 72.97219 0 0 1 170.666667 170.666667h682.666666z" p-id="4941"></path></svg>'
        },
        link: 'mailto:support@cynara.my'
      }
    ],
    footer: {
        message: '<a href="https://icp.gov.moe/?keyword=20257521">萌ICP备20257521号</a>', 
        copyright: '2025 <a href="https://www.cynara.my">Cynara Group</a>. All rights reserved.' 
    },
  }
})
