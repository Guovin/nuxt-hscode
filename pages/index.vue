<template>
  <div class="home">
    <el-container>
      <el-header>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$route.path==='/table' || this.$route.path==='/detail'">搜索结果
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$route.path==='/detail'">内容详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- logo区域 -->
        <div class="logo_container">
          <span class="logo"
                @click="goHome">
            <span class="hs">HS</span>Code
          </span>
        </div>
      </el-header>
      <el-main>
        <el-card class="searchCard">
          <!-- 搜索区域 -->
          <el-input placeholder="请输入商品名称或商品编码"
                    v-model="key"
                    @change="inputChange"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getKey"></el-button>
          </el-input>
        </el-card>
        <nuxt-child ref="child" />
      </el-main>
      <el-footer class="footer">
        copyright <a href="https://www.hscode.vip"
           target="blank">www.hscode.vip</a> 版权归 HSCode编码网 <a href="#"
           @click="drawer = true">网站声明</a>
        <div class="note">本站所有数据仅供学习与参考，如有疑问，请联系360996299@qq.com！</div>
      </el-footer>
    </el-container>
    <!-- 回到顶部 -->
    <el-backtop target=".home"
                :visibility-height="150"></el-backtop>
    <!-- 网站声明 -->
    <el-drawer title="免责声明"
               size="250px"
               :visible.sync="drawer"
               :direction="direction"
               :before-close="handleClose">
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
export default {
  data () {
    return {
      // 关键词
      key: '',
      drawer: false,
      direction: 'btt',
    }
  },
  methods: {
    // 根据关键词获取数据列表
    getKey () {
      this.$router.push({
        path: 'table',
        query: {
          key: encodeURIComponent(this.key).replace(/%/g, '%25')
        }
      })
    },
    //输入框change事件
    inputChange () {
      if (this.$route.path === '/table') {
        return this.$refs['child'].getListByKey(encodeURIComponent(this.key).replace(/%/g, '%25'))
      }
      this.getKey()
    },
    //网站声明抽屉
    handleClose (done) {
      done()
    },
    //返回首页
    goHome () {
      if (this.$route.path !== '/') {
        return this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.home {
  height: 100%;
  overflow: auto;
  display: flex;
  min-height: 100vh;
}

.el-header {
  height: 100px !important;
}

.el-card {
  margin: auto;
  margin-top: 50px;
  margin-bottom: 30px;
  width: 50%;
}

.el-breadcrumb {
  margin-top: 10px;
}

.footer {
  width: 100%;
  text-align: center;
  font-size: 14px;
  background-color: #1f2939;
  height: 30px;
  line-height: 30px;
}

.note {
  font-size: 10px;
}

.el-drawer div {
  font-size: 10px;
  margin-left: 10px;
}

.searchCard {
  background-color: rgba(255, 255, 255, 0.01);
  border: rgba(255, 255, 255, 0.01);
}
</style>