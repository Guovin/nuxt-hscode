<template>
  <div class="barcode">
    <div id="title">条形码生成器</div>
    <div class="row">
      <!-- 条码格式级联选择器 -->
      <div class="format">
        <span class="title">格式:</span>
        <el-cascader v-model="value" :show-all-levels="false" :options="options" :props="{ expandTrigger: 'hover' }">
        </el-cascader>
      </div>
      <!-- 条码宽度 -->
      <div class="width">
        <span class="title">宽度:</span>
        <el-input v-model="width" @blur="widthChange"></el-input>
      </div>
      <!-- 条码高度 -->
      <div class="width">
        <span class="title">高度:</span>
        <el-input v-model="height" @blur="heightChange"></el-input>
      </div>
      <!-- 条码颜色 -->
      <div class="color">
        <span class="title">颜色:</span>
        <el-color-picker v-model="color" @change="colorChange"></el-color-picker>
      </div>
      <!-- 条码字体 -->
      <div class="fontSize">
        <span class="title">字体大小:</span>
        <el-input v-model="fontSize" @blur="fontChange"></el-input>
      </div>
      <div class="textMargin">
        <span class="title">字体间距:</span>
        <el-input v-model="textMargin" @blur="textChange"></el-input>
      </div>
    </div>
    <!-- 条码原始数据 -->
    <div class="text">
      <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入条码数据,若有多条,请用“,”分隔" v-model="text">
      </el-input>
    </div>
    <!-- 输出按钮 -->
    <div class="button">
      <el-button type="primary" @click="createBarCode" class="buttonYes">确定</el-button>
      <el-button type="warning" @click="printBarCode" class="buttonYes" v-if="status">打印</el-button>
    </div>
    <!-- 条码画布 -->
    <div class="canvas" v-show="status">
      <canvas id="code"></canvas>
    </div>
    <!-- 打印区域 -->
    <iframe id="iframe" name="iframeName" style="display: none;">
    </iframe>
  </div>
</template>

<script>
  import JsBarcode from 'jsbarcode'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        // 原始数据
        text: '',
        // 条码宽度
        width: 2,
        // 条码高度
        height: 80,
        // 字体大小
        fontSize: 20,
        // 字体间距
        textMargin: 2,
        // 条码颜色
        color: '#000000',
        // 选中的条码格式
        value: ["CODE128", "CODE128"],
        // 条码生成状态
        status: false,
        // 条码格式
        options: [
          {
            label: 'CODE128',
            value: 'CODE128',
            children: [
              { label: 'CODE128', value: 'CODE128' },
              { label: 'CODE128 A', value: 'CODE128 A' },
              { label: 'CODE128 B', value: 'CODE128 B' },
              { label: 'CODE128 C', value: 'CODE128 C' },
            ]
          },
          {
            label: 'EAN',
            value: 'EAN',
            children: [
              { label: 'EAN-13', value: 'EAN-13' },
              { label: 'EAN-8', value: 'EAN-8' },
              { label: 'EAN-5', value: 'EAN-5' },
              { label: 'EAN-2', value: 'EAN-2' },
              { label: 'UPC (A)', value: 'UPC (A)' },
              { label: 'UPC (E)', value: 'UPC (E)' },
            ]
          },
          { label: 'CODE39', value: 'CODE39' },
          {
            label: 'ITF',
            value: 'ITF',
            children: [
              { label: 'ITF', value: 'ITF' },
              { label: 'ITF-14', value: 'ITF-14' }
            ]
          },
          {
            label: 'MSI',
            value: 'MSI',
            children: [
              { label: 'MSI10', value: 'MSI10' },
              { label: 'MSI11', value: 'MSI11' },
              { label: 'MSI1010', value: 'MSI1010' },
              { label: 'MSI1110', value: 'MSI1110' }
            ]
          },
          {
            label: 'Pharmacode',
            value: 'Pharmacode'
          },
          {
            label: 'Codabar',
            value: 'Codabar'
          },
        ]
      }
    },
    methods: {
      // 条码绘制方法
      barCode(id, text) {
        JsBarcode(id, text, {
          format: this.value.length == 0 ? this.value[0] : this.value[1],
          lineColor: this.color,
          width: this.width,
          height: this.height,
          fontSize: this.fontSize,
          displayValue: true,
          textMargin: this.textMargin,
        })
      },
      // 条码绘制至画布
      createBarCode() {
        if (process.client) {
          let text = this.text
          if (text != '') {
            // 多次生成先初始化再生成
            let canvasTag = document.getElementsByClassName("canvas")[0]
            if (this.status == true) {
              canvasTag.innerHTML = ""
              let canvas = document.createElement("canvas")
              canvas.id = "code"
              canvasTag.appendChild(canvas)
            }
            let textList
            if (text.indexOf('，') != -1) {
              textList = text.split('，')
            } else {
              textList = text.split(',')
            }
            // 遍历绘制全部条形码
            try {
              textList.forEach((item, index) => {
                let id
                if (item == "") {
                  return
                }
                if (index == 0) {
                  id = "#code"
                } else {
                  id = "#code" + index
                  let canvas = document.createElement("canvas")
                  canvas.id = "code" + index
                  canvasTag.appendChild(canvas)
                }
                this.barCode(id, item)
              })
              this.status = true
              // 提前生成打印标签
              this.createPrint()
              return Message.success({ message: "生成条形码成功！", center: true })
            }
            catch (error) {
              console.log(error)
              return Message.error({ message: "请输入符合格式的数据！", center: true })
            }
          } else {
            return Message.error({ message: "请输入条行码数据！", center: true })
          }
        }
      },
      // 生成打印内容
      createPrint() {
        // 获取打印内容
        // 获取所有canvas标签
        let html = document.getElementsByTagName("canvas")
        // 获取iframe
        let iframe = document.getElementById("iframe")
        let newDiv = document.createElement("div")
        // 遍历生成含img标签的div
        html.forEach(item => {
          // 获取canvas的Base64用于转换图片
          let htmlBase64 = item.toDataURL()
          let newHtml = document.createElement("img")
          newHtml.src = htmlBase64
          newHtml.style.margin = "0px 50px 20px 0px"
          newDiv.appendChild(newHtml)
        })
        // 将图片div添加至iframe打印区域
        iframe.contentDocument.body.innerHTML = newDiv.innerHTML
      },
      // 条码打印
      printBarCode() {
        // 输出打印
        window.frames['iframeName'].print()
      },
      // 失去焦点事件触发
      widthChange() {
        if (this.width == '') {
          this.width = 2
        }
      },
      heightChange() {
        if (this.height == '') {
          this.height = 80
        }
      },
      fontChange() {
        if (this.fontSize == '') {
          this.fontSize = 20
        }
      },
      textChange() {
        if (this.textMargin == '') {
          this.textMargin = 2
        }
      },
      colorChange() {
        if (this.color == null) {
          this.color = '#000000'
        }
      },
    },
    created() {
    },
    head() {
      return {
        title: 'HSCode编码-条形码生成器',
        meta: [
          { hid: 'keywords', name: 'keywords', content: '外贸、跨境、海关编码、查询、hscode查询、hscode编码、搜索' },
          { hid: 'description', name: 'description', content: '最全面、方便、准确的外贸、跨境、海关编码查询、hscode查询' }
        ]
      }
    }
  }
</script>
<style>
  #title {
    width: 100px;
    font-size: 14px;
    margin: 0 auto;
    color: cadetblue;
    margin-bottom: 10px;
  }

  #title::before {
    font-family: "iconfont";
    content: "\e642";
  }

  .barcode {
    width: 80%;
    margin: 0 auto;
    border: 1px solid #ebeef5;
    background-color: #fff;
    transition: .3s;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
    padding: 5px 20px 20px 20px;
  }

  .title {
    white-space: nowrap;
    align-self: center;
    color: rgb(136, 134, 134);
    padding-right: 5px;
  }

  .colorTitle {
    white-space: nowrap;
  }

  .width,
  .height,
  .fontSize,
  .textMargin {
    width: 13%;
    display: flex;
    justify-content: space-around;
  }

  .color {
    display: flex;
    width: 8%;
  }

  .format {
    width: 20%;
    display: flex;
    justify-content: space-around;
  }

  .text {
    margin-top: 20px;
  }

  .el-input__inner {
    text-align: center;
  }

  .row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .button {
    margin: 0 auto;
    text-align: center;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .buttonYes {
    margin: 0 50px;
  }

  .canvas {
    margin: 20px auto;
    text-align: center;
  }

  .el-cascader-menu {
    height: 270px;
  }

  .el-cascader-menu__wrap {
    height: 100%;
  }

  @media screen and (max-width:480px) {
    .barcode {
      width: 100%;
      padding: 5px 5px 20px 5px;
    }

    .format {
      width: 50%;
      margin-bottom: 6px;
    }

    .width {
      width: 40%;
      margin-bottom: 6px;
    }

    .color {
      width: 40%;
      margin-bottom: 6px;
    }

    .fontSize,
    .textMargin {
      width: 40%;
      margin-bottom: 6px;
    }

    .message_container {
      top: 85% !important;
    }
  }
</style>