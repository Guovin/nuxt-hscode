import Vue from 'vue'
import {
  Container, Header, Main, Input, Message, Table,
  TableColumn, Card, Button, Pagination, Dialog,
  Breadcrumb, BreadcrumbItem, Backtop, Icon,
  Row, Col, Footer, Drawer
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Backtop)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Footer)
Vue.use(Drawer)

Vue.prototype.$message = Message
