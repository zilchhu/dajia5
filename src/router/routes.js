import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import menuList from "../pages/sys/menu.vue";
import role from "../pages/sys/role.vue";
import resource from "../pages/sys/resource.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/user.vue";
import userAdd from "../pages/sys/userAdd.vue";
import resetPwd from "../pages/resetPwd.vue";
import mtOrderData from "../pages/mt/orderData"
import mtOrderData1 from "../pages/mt/orderData1"
import scoreDate from "../pages/mt/scoreDate"
import newShop from "../pages/public/newShop"

// Routes
const routes = [
  {path: '/login', component: login},
  {
    path: '/test', component: app, children: [
      {path: '*', component: NotFoundView}
    ]
  },
  {
    path: '', component: app, children: [
      {path: '/resetPwd', component: resetPwd},
      {path: '/index', component: dashboard},
      {path: '/sys/menuList', component: menuList},
      {path: '/sys/roleList', component: role},
      {path: '/sys/userList', component: sysUser},
      {path: '/sys/userAdd', component: userAdd},
      {path: '/sys/resource', component: resource},
      {path: '/mt/bizdata/orderData', component: mtOrderData},
      {path: '/mt/bizdata/orderData1', component: mtOrderData1},
      {path: '/mt/bizdata/scoreDate', component: scoreDate},
      {path: '/public/newShop', component: newShop}

    ]
  },
  {path: '*', component: NotFoundView}
]


export default routes

