<template>
  <div class="table">
    <!-- 卡片视图区域 -->
    <el-card v-if="showCard" class="tableCard">
      <!-- 表格区域 -->
      <el-table :data="keyList" border stripe class="outTable">
        <el-table-column prop="hscode" label="商品编号" header-align="center" align="center">
        </el-table-column>
        <el-table-column label="商品名称" header-align="center" align="center">
          <template slot-scope="scope">
            <span v-html="showDate(scope.row.product_name)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="hscode_name" label="商品分类" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="unit" label="计量单位" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="export_retax" label="出口退税率(%)" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="supervision_code" label="监管条件" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="ciq_code" label="检验检疫" header-align="center" align="center">
        </el-table-column>
        <el-table-column label="更多信息" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="primary"
              @click="showDetail(scope.row.hscode,scope.row.product_name,scope.row.element_example)" size="mini">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区域 -->
      <nav class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 7, 10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
          background>
        </el-pagination>
      </nav>
    </el-card>
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
        //控制卡片是否显示
        showCard: false,
        // 关键词搜索列表
        keyList: [],
        // hscode
        hscode: '',
        // hscode搜索列表
        hscodeList: [],
        // 总数据条数
        total: 0,
        // 当前页码数
        currentPage: 1,
        // 当前页显示数据条数
        pageSize: 10,
        //url
        urlKey: ''
      }
    },
    methods: {
      // 根据关键词获取数据列表
      async getListByKey(key) {
        //传入的key是经转码的
        //解码保存
        let decodeKey = decodeURIComponent(key)
        this.key = decodeKey
        //保存当前查询结果的key，避免用户修改输入框导致分页错误
        this.urlKey = decodeKey
        const { data: res } = await this.$http.post(`search?keyword=${key}`)
        if (res.code !== 200) {
          return this.$message.error(`${res.data}`)
        }
        this.showCard = true
        // 根据分页显示要求处理数据
        //当是第一页时显示
        if (this.currentPage === 1) {
          this.keyList = res.data.list.slice(0, this.pageSize)
        }
        //当不是第一页时显示
        else {
          this.keyList = res.data.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
        this.total = res.data.length
      },
      // 分页条数改变触发事件
      handleSizeChange(newPageSize) {
        this.pageSize = newPageSize
        //需要转码后再执行搜索
        this.getListByKey(encodeURIComponent(this.urlKey))
      },
      // 分页当前页切换触发事件
      handleCurrentChange(newPage) {
        this.currentPage = newPage
        this.getListByKey(encodeURIComponent(this.urlKey))
      },
      // 点击详情跳转
      showDetail(hscode, title, example) {
        this.$router.push({
          path: 'detail',
          query: {
            //链接携带的参数转码传输
            hscode: hscode,
            title: encodeURIComponent(title),
            example: encodeURIComponent(example)
          }
        })
      },
      // 筛选变色
      showDate(val) {
        val = val + ''
        const keys = this.key.split('')
        //遍历搜索词，商品名称存在该字的话就变色
        keys.forEach(item => {
          if (val.indexOf(item) !== - 1 && item !== '') {
            return val = val.replace(eval(`/${item}/g`), '<font color="#409EFF">' + item + '</font>')
          } else {
            return val = val
          }
        })
        return val
      }
    },
    async asyncData({ query }) {
      //需要再转码一次再发送，以实现能正常查看源码
      const { data: res } = await axios.post(`search?keyword=${encodeURIComponent(query.key)}`)
      if (res.code !== 200) {
        return Message.error(`${res.data}`)
      }
      return { key: decodeURIComponent(query.key), urlKey: decodeURIComponent(query.key), keyList: res.data.list, showCard: true, total: res.data.length }
    },
    head() {
      return {
        title: 'HSCode编码-搜索结果',
        meta: [
          { hid: 'keywords', name: 'keywords', content: '外贸、跨境、海关编码、查询、hscode查询、hscode编码、搜索' },
          { hid: 'description', name: 'description', content: '最全面、方便、准确的外贸、跨境、海关编码查询、hscode查询' }
        ]
      }
    }
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
    width: 80%;
    margin: auto;
  }

  .page {
    text-align: center;
  }

  .tableCard {
    background-color: rgba(255, 255, 255, 0.01);
    border: rgba(255, 255, 255, 0.01);
  }

  .outTable {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .el-pagination {
    background-color: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px 0 10px 0;
  }
</style>