<template>
  <div class="home">
    <el-container>
      <el-header>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" @click.native="changeTitle"><i class="iconfont iconshouye"></i>首页
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$route.path==='/table' || this.$route.path==='/detail'"><i
              class="iconfont iconsousuo"></i>搜索结果
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$route.path==='/detail'"><i class="iconfont iconpicixiangqing"></i>内容详情
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- logo区域 -->
        <div class="logo_container">
          <!-- <span class="logo" @click="goHome">
            <span class="logo_hs">HS</span><span>Code<span class="logo_vip">.VIP</span></span>
          </span> -->
          <img class="logo_img" src="../assets/logo.png" alt="HSCode.VIP" @click="goHome"><img>
        </div>
      </el-header>
      <el-main>
        <el-card class="searchCard">
          <!-- 搜索区域 -->
          <transition name="emerge" appear>
            <keep-alive>
              <el-input placeholder="请输入商品名称或商品编码" v-model="key" @keyup.enter.native="inputKeyUpEnter" clearable>
                <el-button slot="append" icon="el-icon-search" @click="inputKeyUpEnter"></el-button>
              </el-input>
            </keep-alive>
          </transition>
        </el-card>
        <!-- 树形分类区域 -->
        <el-card v-if="this.$route.path==='/'" class="treeCard">
          <transition name="emerge" appear>
            <keep-alive>
              <div class="tree_card">
                <div class="cate_title"><i class="iconfont iconfenleishouye"></i>HSCode商品编码分类</div>
                <el-tree :load="loadNode" lazy :props="treeProps">
                  <!-- 自定义渲染节点内容 -->
                  <span class="span-ellipsis" slot-scope="{ node, data }">
                    <span>
                      <!-- 通过判断是否是叶子节点来显示查看按钮 -->
                      <el-button type="text" size="mini" v-show="node.isLeaf == true" @click="() => searchPrefix(data)">
                        HSCode查询
                      </el-button>
                    </span>
                    <span class="parentFont">{{ node.label }}</span>
                  </span>
                </el-tree>
              </div>
            </keep-alive>
          </transition>
        </el-card>
        <!-- 热门搜索区域 -->
        <el-card v-if="this.$route.path==='/'" class="treeCard">
          <transition name="emerge" appear>
            <keep-alive>
              <div class="hot_card">
                <div class="hot_title"><i class="iconfont iconremen"></i>热门HSCode商品编码</div>
                <el-row :gutter="8">
                  <el-col v-for="(item,index) in hotData" :key="index" :span="4" v-if="index < 60">
                    <div @click="hotSearch(item)" class="hot_smallCard">
                      <p>{{item}}</p>
                    </div>
                  </el-col>
                </el-row>
                <transition name="hotEmerge">
                  <keep-alive>
                    <el-row :gutter="8" v-show="closeMore">
                      <el-col v-for="(item,index) in hotData" :key="index" :span="4" v-if="index >= 60">
                        <div @click="hotSearch(item)" class="hot_smallCard">
                          <p>{{item}}</p>
                        </div>
                      </el-col>
                    </el-row>
                  </keep-alive>
                </transition>
                <el-row class="showMoreRow">
                  <!--收起和展开按钮-->
                  <el-col :span="5">
                    <div class="shrink" v-if="hotData.length > 60" @click='toggle(2)'>
                      {{closeMore ? '收起': '查看更多'}}
                      <i :class="closeMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </keep-alive>
          </transition>
        </el-card>
        <nuxt-child ref="child" />
        <!-- 消息头像标识 -->
        <div class="message_container" @click="dialogFormVisible = true">
          <div class="message_avatar">
          </div>
          <div class="status_spot"></div>
        </div>
      </el-main>
      <el-footer class="footer">
        copyright <a href="https://www.hscode.vip" style="color:#317EB2;text-decoration:none;"
          target="blank">www.hscode.vip</a> 版权归 HSCode编码网
        <span style="color:#317EB2;" @click="drawer = true" class="statement">网站声明</span>
        <div class="note">本站所有数据仅供学习与参考，如有疑问，请<span class="feedback" style="color:#317EB2;"
            @click="dialogFormVisible = true">
            反馈
          </span>
        </div>
        <a href=" https://www.miit.gov.cn/" style="color:#317EB2; text-decoration:none;"
          target="blank">粤ICP备20062496号-1</a>
      </el-footer>
    </el-container>
    <!-- 回到顶部 -->
    <el-backtop :visibility-height="60">
      <i class="el-icon-caret-top"></i>
    </el-backtop>
    <!-- 网站声明 -->
    <el-drawer title="免责声明" size="250px" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <div>
        1、HSCode编码网(www.hscode.vip)提醒您：在使用HSCode编码网提供的任何服务前，请务必仔细阅读并透彻理解本免责声明，您可以选择不使用HSCode编码网提供的服务，但如果您使用HSCode编码网的任何服务，您的使用行为将被视为对本声明全部内容的完全认可。
        <br>
        2、凡本网提供的全部信息，仅作为参考，不得用于行政或司法程序，HSCode编码网网不承担由此引发的任何责任。<br>
        3、您通过使用HSCode编码网提供的搜索服务而获得的任何由第三方制作或提供之内容(包括但不限于针对第三方内容所进行的任何点评留言)，HSCode编码网公司对其合法性、准确性、真实性、适用性、安全性等概不负责，亦不承担任何法律责任。因使用或依赖第三方提供内容或服务所产生的损失或损害，HSCode编码网也不负担任何责任。<br>
        4、本网站所载的资料的版权和其他知识产权属于有关拥有人，并由有关拥有人保留。HSCode编码网不会对任何人因实际或指称侵犯版权或其他知识产权所引致的损失或损害承担责任。<br>
        5、您应该对使用HSCode编码网的结果自行承担风险。HSCode编码网不做任何形式的保证：不保证HSCode编码网提供的服务完全满足您的要求，不保证HSCode编码网的服务不中断，不保证HSCode编码网网的服务的安全性、正确性、及时性、合法性。因网络状况、通讯线路等任何原因而导致您不能正常使用HSCode编码网，HSCode编码网概不负责，亦不对其承担任何法律责任。<br>
        6、您通过HSCode编码网搜索到的HSCode编码网之合作单位所提供的任何内容(包括但不仅限于图示、数据、文字等)，由该合作单位对其合法性、准确性、真实性、适用性、安全性等负责，HSCode编码网对其不承担任何法律责任。
      </div>
    </el-drawer>

    <!-- 反馈对话框区域 -->
    <el-dialog class="feedBack_dialog" title="反馈建议" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
      @opened="openDialog">
      <div class="history_message" ref='history_div'>
        <div v-if="nothingTip" class="nothing_tip"><span class="tip_content">无反馈记录</span></div>
        <div class="sent_message" v-for="(message,index) in myCookie" :key="index">
          <div v-html="showEmailAddress(message)" class="sent_address"></div>
          <i class="iconfont iconchenggong"></i>
          <div class="content_time">
            <p v-html="showMessage(message)" class="sent_content"></p>
            <div v-html="showTime(message)" class="sent_time"></div>
          </div>
        </div>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="您的邮箱地址" prop="name">
          <el-col :span="11">
            <el-input v-model="form.name" placeholder="请输入您的邮箱地址" prefix-icon="el-icon-message"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="反馈内容" prop="massage">
          <el-input type="textarea" v-model="form.massage" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeFeedBack">取 消</el-button>
        <el-button type="primary" @click="FeedBack">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { Message } from 'element-ui'
  export default {
    data() {
      // 验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          // 合法邮箱
          return cb()
        }
        cb(new Error('请输入正确的邮箱地址'))
      }
      return {
        // 关键词
        key: '',
        drawer: false,
        direction: 'btt',
        // 树形分类父节点数据
        parentData: [],
        // 树形分类子节点数据
        childrenData: [],
        // 树形分类选项配置
        treeProps: {
          label: 'class', // 配置节点属性名称
          isLeaf: 'leaf' // 配置叶子节点属性名称
        },
        // 首页热门搜索
        hotData: ['女式连衣裙', '女式T恤衫', '女式裤子', '女式衬衫', '鞋子', '袜子', '耳环', '发饰', '女式套装', '女式背心', '女式内衣', '女式外套', '女式卫衣', '女式睡衣套装', '项链', '女式裙子', '女式毛衣', '收纳盒', '女式连体衣', '厨房用品', '女式睡裙', '手机壳', '腰带', '仿首饰', '戒指', '手提包', '帽子', '手链', '女童套装', '女童连衣裙', '墙贴', '女式泳衣', '斜挎包', '摆件', '男式卫衣', '灯具', '墨镜', '女式内裤', '口红', '女式夹克', '枕头', '贴纸', '收纳袋', '烘焙模具', '指甲贴片', '化妆刷', '女童卫衣', '男童套装', '女式睡袍', '围巾', '浴室用品', '男式背心', '清洁刷', '气球', '眼影', '女童裤子', '男式裤子', '收纳架', '手表', '眼线', '粉底', '化妆包', '胸针', '文具套装', '塑料植物', '女式西装', '男式T恤衫', '钱包', '女童连体衣', '手机支架', '衣架', '粉扑', '挂钩', '钥匙扣', '手套', '梳子', '窗帘', '保护套', '女童外套', '毛巾', '沙发套', '收腹带', '男式睡衣套装', '男童卫衣', '男式套装', '双肩包', '男式衬衫', '按摩器', '床单', '假睫毛', '水杯', '男式夹克', '地毯', '眉笔', '乳贴', '指甲工具', '枕套', '假发', '口罩', '收纳筐', '面膜', '塑料瓶', '睫毛膏', '腮红', '女童衬衫', '餐垫', '腰包', '勺子', '男式毛衣', '夹子', '女童毛衣', '男童睡衣套装', '浴球', '笔记本', '女童裙子', '胶带', '男童裤子', '餐具', '刮刀', '遮瑕膏', '桌布', '拉力绳', '男童夹克', '宠物服装', '搅拌器', '指甲贴纸', '美容工具', '手机贴膜', '修正带', '修眉器', '封口机', '相框', '餐盘', '女童泳衣', '男式内裤', '表带', '女式裤袜', '胶垫', '包装袋', '便签贴', '男童毛衣', '美容仪', '睫毛夹', '文具袋', '鞋垫', '卷发器', '数据线', '宠物配饰', '文件夹', '手机配件', '耳机线', '留言卡', '粘毛器', '围裙', '女童睡衣套装', '浴帽', '叉子', '男童外套', '包包挂件', '穿耳器', '暖水袋', '刻度尺', '洗面奶', '男童衬衫', '触屏笔', '时钟', '指甲锉', '粉刺针', '化妆镜', '笔筒', '纸杯', '开口器', '抹布', '化妆棉', '眼罩', '男童背心', '毛毯', '毯子', '烛台', '宠物绳', '宠物美容用品', '鼠标垫', '迷你加湿器', '橡皮擦', '护手霜', '包装盒', '防尘袋', '男童连体衣', '挂绳', '吸管', '发夹', '印章', '宠物餐具', '握力器', '信封', '面粉筛', '耳罩', '洁面刷', '牙刷', '烤盘', '文胸排扣', '袖套', '卡套', '水彩笔', '装饰绳', '塑料袋', '吸油纸', '剪刀', '锁扣', '防水鞋套', '宠物垫', '固线器', '护具', '笔刨', '宠物项圈', '女童睡裙', '肩带', '被套', 'LED灯', '女童夹克', '装饰纸', '针线套装', '男式泳衣', '镊子', '书签', '精华液', '台历', '指甲钳套装', '画板', '女童内裤', '杯垫', '浴巾', '收纳桶', '刮舌器', '肥皂盒', '雨衣', '刮毛器', '矫正器', '男 式外套', '男式西装', 'U盘', '文件袋', '男式睡袍', '美发器', '护臀霜', '手机镜头', '纸巾', '眉夹', '鼠标', '牙签', '跳绳', '美发工具', '修剪器', '裁剪器', '喷雾', '身体乳', '磨砂膏', '雨伞', '洁面仪', '宠物床', '宠物用品', '脚膜', '沙滩毯', '游戏机', '洁牙器', '麦克风', '雕刻笔', '宠物清洁用具', '打气筒', '棉签棒', '耳塞', '计时器', '围脖', '打孔器', '止鼾器', '充电头', '首饰盘', '键盘', '腿环', '调色盘', '男童内裤', '铅笔', '明信片', '宠物包', '收纳环', '维修工具', '唇彩', ' 拉手', '女童背心', '装饰棒', '棉线', '手膜', '握笔器', '过滤纸', '修脚器', '染色套装', '修皮器', '迷你投影仪', '小风扇', '瑜伽夹', '健腹器', '护颈霜', '吊牌', '卡包', '除味器', '纸巾盒', '音乐盒', '电动牙刷', '塑料碗', '耳机', '拔罐器', '图钉', '脱毛仪', '放大镜', '掏耳器', '开瓶器', '宠物雨衣', '胶带器', '瓶塞', '瑜伽砖', '写字板', '男式连体衣', '过滤网', '遥控器', '布贴', '牙线', '门挡', '转接头', '内衣配件', '卡托', '钳子', '电动理发器', '按摩仪', '瑜伽球', '刨丝器', '过滤器', '女童睡袍', '肥皂', '塑料菜板', '漏斗', '车载吸尘器', '裱花工具', '清洗器', '塑料铲', '牙刷架', '起钉器', '排插', '眉卡', '洁牙器喷嘴', '遮挡板', '削皮器', '挂烫机', '榨汁机', '磨刀器', '牙刷替换头', '迷你吸尘器', '健身球', '领带', '清洁海绵', '钉书钉', '抓痒器', '笔盖', '被子', '发带', '纸袋', '椅垫', '拖把架'],
        // 反馈对话框是否显示
        dialogFormVisible: false,
        // 反馈表单
        form: {
          name: '',
          massage: ''
        },
        // 反馈表单验证规则
        rules: {
          name: [
            { required: true, message: '请输入您的邮箱地址', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          massage: [
            { required: true, message: '请输入反馈的内容', trigger: 'blur' }
          ]
        },
        showMore: false,//显示-显示更多
        closeMore: false,//显示-收起
        transitionName: '', // 过渡名称
        myCookie: [], //cookie
        nothingTip: true //无反馈记录提示
      }
    },
    methods: {
      // 根据关键词获取数据列表
      async getKey() {
        if (this.key !== '') {
          // 判断搜索关键词合法性
          const { data: res } = await this.$http.post(`search?keyword=${encodeURIComponent(this.key)}`)
          if (res.code !== 200) {
            return this.$message.error({ message: `${res.data}`, center: true })
          } else {
            this.$router.push({
              path: 'table',
              query: {
                // 链接携带的参数转码传输
                key: encodeURIComponent(this.key)
              }
            })
          }
        } else {
          return this.$message.info({ message: "请输入搜索内容！", center: true })
        }
      },
      // 输入框回车事件
      inputKeyUpEnter() {
        if (this.key !== '') {
          if (this.$route.path === '/table') {
            // url的query参数根据搜索而变化，实现源码也能动态刷新
            var { merge } = require('webpack-merge')
            this.$router.push({
              query: merge(this.$route.query, { 'key': encodeURIComponent(this.key) })
            })
            return this.$refs['child'].getListByKey(encodeURIComponent(this.key))
          } else {
            this.getKey()
          }
        }
        else {
          return this.$message.info({ message: '请输入搜索内容！', center: true })
        }
      },
      // 网站声明抽屉
      handleClose(done) {
        done()
      },
      // 返回首页
      goHome() {
        if (this.$route.path !== '/') {
          this.changeTitle()
          return this.$router.push('/')
        }
      },
      // 树形控件数据加载
      loadNode(node, resolve) {
        if (node.level === 0) {
          // 初始化树状图最开始就展示的数据
          let res = []
          this.parentData.forEach((value) => {
            res.push({ class: value })
          })
          return resolve(res);
        }
        if (node.level > 1) return resolve([]);
        // 根据父节点的名称寻找子节点数据
        let parentClass = node.data.class
        let data = this.childrenData[parentClass]
        let children = []
        // 遍历加载叶子节点
        data.forEach((value) => {
          // class用于显示名称，leaf显示为叶子节点，prefix用于查看跳转
          children.push({ class: value.sub_class, leaf: true, prefix: value.hscode_prefix })
        })
        resolve(children);
      },
      // 查询hscode前缀
      searchPrefix(data) {
        // 根据当前叶子节点的prefix属性来搜索
        this.$router.push({
          path: 'table',
          query: {
            // 链接携带的参数转码传输
            key: encodeURIComponent(data.prefix)
          }
        })
      },
      // 统计功能
      statistic() {
        if (process.client) {
          var _hmt = _hmt || [];
          (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?2f646b2e73936a9ab950f9adfa665211";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();
        }
      },
      // 点击首页面包屑或使用浏览器返回上一页，修改head的title
      changeTitle() {
        if (process.client) {
          // 修改head的title
          document.title = 'HSCode编码查询-首页'
        }
      },
      // 根据热门搜索编码跳转查询
      hotSearch(item) {
        this.$router.push({
          path: 'table',
          query: {
            // 链接携带的参数转码传输
            key: encodeURIComponent(item)
          }
        })
      },
      // 反馈
      FeedBack() {
        this.$refs.formRef.validate(async valid => {
          if (!valid) return false
          // 验证通过
          let { data: res } = await this.$http.post('/feedBack/massage', this.form)
          if (res.code !== 200) {
            return this.$message.error({ message: "发送失败！", center: true })
          }
          else {
            //保存消息记录
            let newDate = new Date()
            let name = `${this.form.name},${newDate.toLocaleString()}`
            let message = this.form.massage
            if (process.client) {
              // 创建cookie
              document.cookie = `${name}=` + message
            }
            this.getCookie()
            // this.$message.success({ message: "发送成功，请耐心等待回复！", center: true })
            this.form.massage = ''
            this.$refs.formRef.clearValidate()
          }
        })
      },
      //关闭反馈对话框
      closeFeedBack() {
        this.dialogFormVisible = false
        this.$refs.formRef.clearValidate()
      },
      //显示消息发送的邮箱地址
      showEmailAddress(message) {
        return message.split(',')[0]
      },
      //显示消息发送的时间
      showTime(message) {
        return message.split(',')[1].split('=')[0]
      },

      //显示发送的消息
      showMessage(message) {
        return message.split('=')[1]
      },

      /*
        展开和收起任务列表
        传一个参数id便于区分我的两个任务列表点击事件
      */
      toggle(id) {
        if (id === 1) {
          this.showMore = !this.showMore
        } else {
          this.closeMore = !this.closeMore
        }
      },

      //获取cookie
      getCookie() {
        if (process.client) {
          let allCookie = document.cookie.split(';')
          allCookie.forEach(item => {
            // 筛选聊天记录与避免重复获取已经存在的记录
            if (item.indexOf('@') != -1 && this.myCookie.indexOf(item) == -1) {
              return this.myCookie.push(item)
            }
          })
          // 判断是否存在cookie记录
          if (this.myCookie.length != 0) {
            this.nothingTip = false
            this.form.name = this.myCookie[this.myCookie.length - 1].split(',')[0].trim()
          }
        }
      },
      //打开对话框
      openDialog() {
        this.updateScroll()
      },
      //对话框滚动条默认滑到底部
      updateScroll() {
        if (process.client) {
          let element = this.$refs.history_div
          element.scrollTop = element.scrollHeight
        }
      }
    },
    created() {
      this.statistic()
      this.getCookie()
    },
    async asyncData() {
      let { data: res } = await axios.post('/hscode/getAllHscodeClassify')
      if (res.code !== 200) {
        return Message.error({ message: "获取分类信息失败！", center: true })
      }
      return { parentData: res.data.class, childrenData: res.data.info }
    }
  }
</script>

<style>
  .home {
    height: 100%;
    overflow: auto;
    display: flex;
    min-height: 100vh;
  }

  .el-header {
    height: 100px !important;
  }

  .el-breadcrumb {
    margin-top: 10px;
  }

  .logo_container {
    text-align: center;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .logo:hover {
    cursor: pointer;
  }

  .logo {
    font-size: 55px;
    color: #44BA81;
    letter-spacing: 0;
    text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135;
  }

  .logo_hs {
    color: #0081CD;
    font-size: 55px;
  }

  .logo_vip {
    font-size: 50px;
    color: goldenrod;
    margin-left: 2px;
  }

  .el-drawer__header {
    text-align: center;
  }

  .el-drawer {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .footer {
    width: 100%;
    text-align: center;
    font-size: 14px;
    background-color: #273446;
    height: auto !important;
  }

  .note {
    font-size: 10px;
  }

  .el-drawer div {
    font-size: 10px;
    margin-left: 10px;
  }

  .searchCard {
    margin: auto;
    margin-bottom: 30px;
    width: 50%;
    background-color: rgba(255, 255, 255, 0.01);
    border: rgba(255, 255, 255, 0.01);
  }

  .treeCard {
    margin: auto;
    margin-top: 30px;
    margin-bottom: 10px;
    width: 65%;
    background-color: rgba(255, 255, 255, 0.01);
    border: rgba(255, 255, 255, 0.01);
  }

  .el-tree {
    border-radius: 0.5%;
  }

  .el-tree-node__children span {
    font-size: 12px;
  }

  .parentFont {
    font-size: 15px;
  }

  .el-backtop {
    background-color: #2C3643;
  }

  .hot_title {
    font-size: 16px;
    color: #F56C6C;
    font-weight: bold;
    margin: 0 auto 10px auto;
    text-align: center;
  }

  .hot_smallCard {
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid rgba(95, 92, 92, 0.1);
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 20px 0;
    color: #606266;
  }

  .hot_smallCard:hover {
    color: #409EFF;
    cursor: pointer;
    background-color: rgba(97, 93, 93, 0.06);
  }

  .hot_card .el-row {
    display: flex;
    flex-wrap: wrap;
  }

  .hot_card .el-col {
    margin-top: 5px;
  }

  .hot_card .el-card__body {
    padding: 10px 20px 20px 20px;
  }

  .cate_title {
    font-size: 16px;
    color: #409EFF;
    font-weight: bold;
    margin: 0 auto 5px auto;
    text-align: center;
  }

  .tree_card {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
    padding: 10px 20px 20px 20px;
  }

  .hot_card {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
    padding: 10px 20px 20px 20px;
  }

  .statement {
    cursor: pointer;
    white-space: nowrap;
  }

  .feedback {
    cursor: pointer;
  }

  /* 360°旋转动画 */
  @keyframes revolve {
    100% {
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      /* IE 9 */
      -webkit-transform: rotate(360deg);
      /* Safari and Chrome */
    }
  }

  /* 卡片内容过渡 */
  .emerge-enter-active {
    transition: all .5s linear;
  }

  .emerge-enter {
    transform: translateX(100%);
  }

  /* 热门编码展开过渡 */
  .hotEmerge-enter-active {
    transition: all .5s linear;
  }

  .hotEmerge-enter {
    transform: translateY(100%);
  }

  .message_container {
    position: fixed;
    right: 30px;
    bottom: 100px;
    z-index: 1;
  }

  .message_avatar {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background: url("../static/hscode.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    cursor: pointer;
    animation: revolve 8s infinite linear;
    -webkit-animation: revolve 8s infinite linear;
  }

  .message_avatar:hover {
    animation: paused;
    -webkit-animation: paused;
  }

  .status_spot {
    height: 14px;
    width: 14px;
    background-color: #3BD821;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 2px;
  }

  .shrink {
    font-size: 14px;
    cursor: pointer;
    color: grey;
    text-align: center;
    margin-top: 10px;
  }

  .shrink:hover {
    color: #409EFF;
  }

  .showMoreRow {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .el-dialog {
    border-radius: 1%;
  }

  .feedBack_dialog .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }

  .feedBack_dialog .el-form-item__label {
    padding-bottom: 0;
  }

  .feedBack_dialog .el-form-item {
    margin-bottom: 10px;
  }

  .history_message {
    border-top: 1px solid rgba(95, 92, 92, 0.1);
    border-bottom: 1px solid rgba(95, 92, 92, 0.1);
    max-height: 323px;
    overflow-y: auto;
  }

  .nothing_tip {
    text-align: center;
    color: #a1a6af;
    font-size: 10px;
    padding: 20px 0;
  }

  .sent_message {
    padding-bottom: 15px;
    text-align: right;
    margin-right: 15px;
  }

  .sent_message:nth-child(1) {
    padding-top: 15px;
  }

  .sent_address {
    font-size: 10px;
    color: #878b92;
  }

  .iconchenggong {
    color: #6BC839;
    font-size: 14px;
    vertical-align: bottom;
  }

  .content_time {
    background-color: #D0E9FF;
    border-radius: 6px;
    text-align: center;
    display: inline-block;
    padding: 5px 10px 3px 10px;
    max-width: 90%;
  }

  .sent_content {
    color: #252525;
    text-align: justify;
    display: inline-block;
    margin: auto;
  }

  .sent_time {
    font-size: 10px;
    color: #a1a6af;
    text-align: right;
    margin-top: 3px;
  }

  .tip_content::before {
    content: "";
    width: 70px;
    height: 1px;
    background-color: #a1a6af;
    display: inline-block;
    position: relative;
    top: -5px;
    left: -8px;
  }

  .tip_content::after {
    content: "";
    width: 70px;
    height: 1px;
    background-color: #a1a6af;
    display: inline-block;
    position: relative;
    top: -5px;
    left: 8px;
  }

  .el-dialog__title::before {
    font-family: "iconfont";
    content: "\e64e";
  }

  .cate_title .iconfont {
    font-size: 20px;
  }

  .hot_title .iconfont {
    font-size: 20px;
  }

  .iconfenleishouye,
  .iconremen {
    position: relative;
    right: 3px;
  }

  .logo_img:hover {
    cursor: pointer;
  }

  /* 媒体查询:移动端适配：搜索框、树形控件、反馈框、消息头像、回到顶部、查看更多*/

  @media screen and (max-width: 480px) {
    .el-main {
      padding: 20px 5px 20px 5px;
    }

    .searchCard {
      width: 85%;
    }

    .treeCard {
      margin-top: 0;
      width: 100%;
    }

    .treeCard .el-card__body {
      padding: 20px 10px 20px 10px;
    }

    .tree_card {
      padding: 10px;
    }

    .hot_card {
      padding: 10px;
    }

    .el-dialog__wrapper .el-dialog {
      width: 95% !important;
    }

    .el-dialog__wrapper .el-dialog .el-dialog__body {
      padding: 10px 20px 10px 20px;
      overflow: auto;
    }

    .el-dialog__body .el-col-11 {
      width: 60%;
    }

    .history_message {
      max-height: 246px;
    }

    .message_container {
      right: 12px;
      top: 92%;
      height: 35px;
    }

    .message_avatar {
      width: 35px;
      height: 35px;
    }

    .status_spot {
      width: 8px;
      height: 8px;
      right: 0px;
    }

    .el-backtop {
      right: 10px !important;
      bottom: 80px !important;
    }

    .hot_card .el-col-5 {
      width: 45%;
    }
  }

  /* 处理树形控件:过长内容以...代替显示 */
  @media screen and (max-width: 1350px) {
    .span-ellipsis {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* 修改footer的网站声明样式 */
  @media screen and (max-width:1028px) {
    .el-drawer__body div {
      margin-top: -30px;
    }
  }

  @media screen and (max-width:919px) {
    .el-drawer {
      height: 300px !important;
    }
  }

  @media screen and (max-width:634px) {
    .el-drawer {
      height: 350px !important;
    }
  }

  @media screen and (max-width:525px) {
    .el-drawer {
      height: 400px !important;
    }
  }

  @media screen and (max-width:468px) {
    .el-drawer {
      height: 430px !important;
    }
  }

  @media screen and (max-width:378px) {
    .el-drawer {
      height: 480px !important;
    }
  }

  @media screen and (max-width:341px) {
    .el-drawer {
      height: 550px !important;
    }
  }

  @media screen and (max-width:306px) {
    .el-drawer {
      height: 620px !important;
    }
  }
</style>