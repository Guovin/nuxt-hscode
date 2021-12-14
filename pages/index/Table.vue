<template>
  <div class="table">
    <!-- 卡片视图区域 -->
    <el-card v-if="showCard" class="tableCard">
      <!-- 提醒滑动区域 -->
      <div v-if="needSlide" class="needSlide">请向左滑动查看更多内容</div>
      <!-- 表格区域 -->
      <transition name="emerge" appear>
        <keep-alive>
          <el-table :data="keyList" border stripe :row-key="getRowKey" class="outTable">
            <el-table-column
                v-for="(item, index) in col" :key="index"
                :prop="dropCol[index].prop"
                :label="item.label"
                header-align="center"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                    <!-- 商品名称 -->
                    <!-- 注意：这里要使用dropCol,而不是item，否则引起排序问题 -->
                    <span
                      v-if="dropCol[index].prop === 'product_name'"
                      v-html="showDate(scope.row[dropCol[index].prop])"
                    >
                    </span>
                    <!-- 更多信息 -->
                    <el-button
                      v-else-if="dropCol[index].prop === 'element_example'"
                      type="primary"
                      @click="
                        showDetail(
                          scope.row.hscode,
                          scope.row.product_name,
                          scope.row.element_example
                        )
                      "
                      size="mini"
                      >详情
                    </el-button>
                    <!-- 其它 -->
                    <div v-else>{{ scope.row[dropCol[index].prop] }}</div>
                </template>
              </el-table-column>
          </el-table>
        </keep-alive>
      </transition>
      <!-- 分页功能区域 -->
      <!-- PC端显示 -->
      <nav class="page" v-if="pcPage">
        <transition name="emerge" appear>
          <keep-alive>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 7, 10]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              background
            >
            </el-pagination>
          </keep-alive>
        </transition>
      </nav>

      <!-- 移动端显示 -->
      <nav class="page" v-if="phonePage">
        <transition name="emerge" appear>
          <keep-alive>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 7, 10]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next"
              background
            >
            </el-pagination>
          </keep-alive>
        </transition>
      </nav>
      <nav class="page" v-if="smallPhonePage">
        <transition name="emerge" appear>
          <keep-alive>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 7, 10]"
              :page-size="pageSize"
              :total="total"
              layout="sizes, prev, pager, next"
              background
            >
            </el-pagination>
          </keep-alive>
        </transition>
      </nav>
      <nav class="page" v-if="miniPhonePage">
        <transition name="emerge" appear>
          <keep-alive>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              background
            >
            </el-pagination>
          </keep-alive>
        </transition>
      </nav>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
import Sortable from 'sortable';
export default {
  data() {
    return {
      // 关键词
      key: "",
      //控制卡片是否显示
      showCard: false,
      // 获取每行的key值，必须指定，否则拖拽引起排序错误问题
      getRowKey(row) {
        return row.hscode;
      },
      // 列属性
      col: [
        {
          label: '商品编号',
          prop: 'hscode'
        },
        {
          label: '商品名称',
          prop: 'product_name'
        },
        {
          label: '商品分类',
          prop: 'hscode_name'
        },
        {
          label: '计量单位',
          prop: 'unit'
        },
        {
          label: '出口退税率',
          prop: 'export_retax'
        },
        {
          label: '监管条件',
          prop: 'supervision_code'
        },
        {
          label: '检验检疫',
          prop: 'ciq_code'
        },
        {
          label: '更多信息',
          prop: 'element_example'
        }
      ],
      // 拖拽列属性
      dropCol: [
        {
          label: '商品编号',
          prop: 'hscode'
        },
        {
          label: '商品名称',
          prop: 'product_name'
        },
        {
          label: '商品分类',
          prop: 'hscode_name'
        },
        {
          label: '计量单位',
          prop: 'unit'
        },
        {
          label: '出口退税率',
          prop: 'export_retax'
        },
        {
          label: '监管条件',
          prop: 'supervision_code'
        },
        {
          label: '检验检疫',
          prop: 'ciq_code'
        },
        {
          label: '更多信息',
          prop: 'element_example'
        }
      ],
      // 关键词搜索列表
      keyList: [],
      // hscode
      hscode: "",
      // hscode搜索列表
      hscodeList: [],
      // 总数据条数
      total: 0,
      // 当前页码数
      currentPage: 1,
      // 当前页显示数据条数
      pageSize: 10,
      //url
      urlKey: "",
      //浏览器显示宽度
      screenWidth: "",
      // PC端分页功能
      pcPage: true,
      //移动端分页功能
      phonePage: false,
      smallPhonePage: false,
      miniPhonePage: false,
      // 滑动提醒
      needSlide: false,
    };
  },
  computed: {
    // 筛选变色
    showDate() {
      return function(val){
        val = val + "";
        const keys = this.key.split("");
        //遍历搜索词，商品名称存在该字的话就变色
        keys.forEach((item) => {
          if (val.indexOf(item) !== -1 && item !== "") {
            return (val = val.replace(
              eval(`/${item}/g`),
              '<font color="#409EFF">' + item + "</font>"
            ));
          } else {
            return (val = val);
          }
        });
        return val;
      }
    }
  },
  methods: {
    // 根据关键词获取数据列表
    async getListByKey(key) {
      //传入的key是经转码的
      //解码保存
      let decodeKey = decodeURIComponent(key);
      this.key = decodeKey;
      //保存当前查询结果的key，避免用户修改输入框导致分页错误
      this.urlKey = decodeKey;
      const { data: res } = await this.$http.post(`search?keyword=${key}`);
      if (res.code !== 200) {
        return this.$message.error({ message: `${res.data}`, center: true });
      }
      this.showCard = true;
      // 根据分页显示要求处理数据
      //当是第一页时显示
      if (this.currentPage === 1) {
        this.keyList = res.data.list.slice(0, this.pageSize);
      }
      //当不是第一页时显示
      else {
        this.keyList = res.data.list.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      }
      this.total = res.data.length;
    },
    // 分页条数改变触发事件
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      //需要转码后再执行搜索
      this.getListByKey(encodeURIComponent(this.urlKey));
    },
    // 分页当前页切换触发事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getListByKey(encodeURIComponent(this.urlKey));
    },
    // 点击详情跳转
    showDetail(hscode, title, example) {
      this.$router.push({
        path: "detail",
        query: {
          //链接携带的参数转码传输
          hscode: hscode,
          title: title,
          example: example,
        },
      });
    },
    //根据实时显示宽度调整页面样式
    changeStyle() {
      //显示区域过小，提醒滑动表格
      if (this.screenWidth <= 890) {
        this.needSlide = true;
        this.pcPage = true;
        if (this.screenWidth <= 670) {
          this.phonePage = true;
          this.pcPage = false;
          this.smallPhonePage = false;
          if (this.screenWidth <= 440) {
            this.phonePage = false;
            this.smallPhonePage = true;
            if (this.screenWidth <= 360) {
              this.smallPhonePage = false;
              this.miniPhonePage = true;
            } else {
              this.miniPhonePage = false;
              this.smallPhonePage = true;
            }
          }
        } else {
          this.pcPage = true;
          this.phonePage = false;
        }
      } else {
        this.needSlide = false;
        this.pcPage = true;
        this.phonePage = false;
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.keyList.splice(oldIndex, 1)[0]
          _this.keyList.splice(newIndex, 0, currRow)
        }
      })
    },
    // 列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    }
  },
  created() {
    if (process.client) {
      // 修改head的title
      document.title = "HSCode编码-搜索结果";
    }
  },
  mounted() {
    //由于nuxt服务端渲染，document是不存在的，需要判断process.client来获取
    if (process.client) {
      this.rowDrop()
      this.columnDrop()
      const that = this;
      that.screenWidth = document.body.clientWidth;
      this.changeStyle();
      //调用window.onresize()事件，onresize事件会在窗口或框架被调整大小时触发
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth;
          that.screenWidth = window.screenWidth;
        })();
      };
    }
  },

  watch: {
    // watch侦听器监听的是data中的属性,不能直接监听window
    screenWidth(val) {
      this.screenWidth = val;
      this.changeStyle();
    },
  },
  async asyncData({ query }) {
    //需要再转码一次再发送，以实现能正常查看源码
    const { data: res } = await axios.post(
      `search?keyword=${encodeURIComponent(query.key)}`
    );
    if (res.code !== 200) {
      return Message.error({ message: `${res.data}`, center: true });
    }
    return {
      key: decodeURIComponent(query.key),
      urlKey: decodeURIComponent(query.key),
      keyList: res.data.list,
      showCard: true,
      total: res.data.length,
    };
  },
  head() {
    return {
      title: "HSCode编码-搜索结果",
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: "外贸、跨境、海关编码、查询、hscode查询、hscode编码、搜索",
        },
        {
          hid: "description",
          name: "description",
          content: "最全面、方便、准确的外贸、跨境、海关编码查询、hscode查询",
        },
      ],
    };
  },
};
</script>

<style>
.page {
  text-align: center;
}

.tableCard {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
  width: 80%;
  margin: auto;
  padding: 10 20px 20px 20px !important;
  background-color: rgba(255, 255, 255, 0.01);
  border: rgba(255, 255, 255, 0.01);
}

.table .el-card__body {
  padding: 10px 20px 20px 20px !important;
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

.needSlide {
  font-size: 14px;
  color: gray;
  text-align: center;
  margin-bottom: 5px;
}

.el-table__header th::before {
  font-family: "iconfont";
  display: inline-block;
  font-size: 18px;
  position: relative;
  top: 4px;
}

.el-table__header th:nth-child(1)::before {
  content: "\e656";
}

.el-table__header th:nth-child(2)::before {
  content: "\e617";
}

.el-table__header th:nth-child(3)::before {
  content: "\e60e";
}

.el-table__header th:nth-child(4)::before {
  content: "\e631";
}

.el-table__header th:nth-child(5)::before {
  content: "\e679";
}

.el-table__header th:nth-child(6)::before {
  content: "\e721";
}

.el-table__header th:nth-child(7)::before {
  content: "\e618";
}

.el-table__header th:nth-child(8)::before {
  content: "\e69a";
}

.el-table__header .cell {
  width: auto !important;
  padding: 0 3px !important;
}

/* 媒体查询:移动端适配：表格*/
@media screen and (max-width: 550px) {
  .tableCard {
    width: 100%;
  }

  .tableCard .el-card__body {
    padding: 5px 10px 20px 10px !important;
  }
}
</style>