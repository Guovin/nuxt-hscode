<template>
  <div class="home">
    <el-container>
      <el-header>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" @click.native="changeTitle">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$route.path==='/table' || this.$route.path==='/detail'">搜索结果
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$route.path==='/detail'">内容详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- logo区域 -->
        <div class="logo_container">
          <span class="logo" @click="goHome">
            <span class="hs">HS</span>Code
          </span>
        </div>
      </el-header>
      <el-main>
        <el-card class="searchCard">
          <!-- 搜索区域 -->
          <el-input placeholder="请输入商品名称或商品编码" v-model="key" @keyup.enter.native="inputKeyUpEnter" clearable>
            <el-button slot="append" icon="el-icon-search" @click="inputKeyUpEnter"></el-button>
          </el-input>
        </el-card>
        <!-- 树形分类区域 -->
        <el-card v-if="this.$route.path==='/'" class="treeCard">
          <el-tree :load="loadNode" lazy :props="treeProps">
            <!-- 自定义渲染节点内容 -->
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span>
                <!-- 通过判断是否是叶子节点来显示查看按钮 -->
                <el-button type="text" size="mini" v-if="node.isLeaf == true" @click="() => searchPrefix(data)">
                  查看
                </el-button>
              </span>
              <span class="parentFont">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-card>
        <nuxt-child ref="child" />
      </el-main>
      <el-footer class="footer">
        copyright <a href="https://www.hscode.vip" style="color:#368BC6;text-decoration:none;"
          target="blank">www.hscode.vip</a> 版权归 HSCode编码网
        <a href="#" style="color:#368BC6; text-decoration:none;" @click="drawer = true">网站声明</a>
        <div class="note">本站所有数据仅供学习与参考，如有疑问，请联系360996299@qq.com！</div>
        <a href="https://www.miit.gov.cn/" style="color:#368BC6; text-decoration:none;"
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
  </div>
</template>

<script>
  import axios from 'axios'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        // 关键词
        key: '',
        drawer: false,
        direction: 'btt',
        //树形分类父节点数据
        parentData: [],
        // 树形分类子节点数据
        childrenData: [],
        //树形分类选项配置
        treeProps: {
          label: 'class', //配置节点属性名称
          isLeaf: 'leaf' //配置叶子节点属性名称
        }
      }
    },
    methods: {
      // 根据关键词获取数据列表
      async getKey() {
        if (this.key !== '') {
          //判断搜索关键词合法性
          const { data: res } = await this.$http.post(`search?keyword=${encodeURIComponent(this.key)}`)
          if (res.code !== 200) {
            return this.$message.error({ message: `${res.data}`, center: true })
          } else {
            this.$router.push({
              path: 'table',
              query: {
                //链接携带的参数转码传输
                key: encodeURIComponent(this.key)
              }
            })
          }
        } else {
          return this.$message.info({ message: "请输入搜索内容！", center: true })
        }
      },
      //输入框回车事件
      inputKeyUpEnter() {
        if (this.key !== '') {
          if (this.$route.path === '/table') {
            //url的query参数根据搜索而变化，实现源码也能动态刷新
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
      //网站声明抽屉
      handleClose(done) {
        done()
      },
      //返回首页
      goHome() {
        if (this.$route.path !== '/') {
          this.changeTitle()
          return this.$router.push('/')
        }
      },
      //树形控件数据加载
      loadNode(node, resolve) {
        if (node.level === 0) {
          //初始化树状图最开始就展示的数据
          let res = []
          this.parentData.forEach((value) => {
            res.push({ class: value })
          })
          return resolve(res);
        }
        if (node.level > 1) return resolve([]);
        //根据父节点的名称寻找子节点数据
        let parentClass = node.data.class
        let data = this.childrenData[parentClass]
        let children = []
        //遍历加载叶子节点
        data.forEach((value) => {
          //class用于显示名称，leaf显示为叶子节点，prefix用于查看跳转
          children.push({ class: value.sub_class, leaf: true, prefix: value.hscode_prefix })
        })
        resolve(children);
      },
      //查询hscode前缀
      searchPrefix(data) {
        //根据当前叶子节点的prefix属性来搜索
        this.key = data.prefix
        this.getKey()
      },
      //统计功能
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
      //点击首页面包屑或使用浏览器返回上一页，修改head的title
      changeTitle() {
        if (process.client) {
          // 修改head的title
          document.title = 'HSCode编码查询-首页'
        }
      }
    },
    created() {
      this.statistic()
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

  .footer {
    width: 100%;
    text-align: center;
    font-size: 14px;
    background-color: #27313E;
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
    padding: 10px 0 10px 0;
  }

  .el-tree-node__children span {
    font-size: 10px;
  }

  .parentFont {
    font-size: 14px;
  }

  .el-backtop {
    background-color: #2C3643;
  }

  /* 媒体查询:移动端适配：搜索框、树形控件*/

  @media screen and (max-width: 480px) {
    .searchCard {
      width: 95%;
    }

    .treeCard {
      margin-top: 0;
      width: 100%;
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