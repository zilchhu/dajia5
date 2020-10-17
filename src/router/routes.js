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
import BusinAnaly from "../pages/mt/BusinAnaly"
import newCusManag from "../pages/mt/newCusManag"
import shopRank from "../pages/mt/shopRank"
import promoSpot from "../pages/mt/promoSpot"
import shopSpareas from "../pages/mt/shopSpareas"
import category from "../pages/mt/category"
import foodAmount from "../pages/mt/foodAmount"
import shopActivi from "../pages/mt/shopActivi"
import replyRate from "../pages/mt/replyRate"
import operating from "../pages/mt/operating"
import BusinPassenger from "../pages/mt/BusinPassenger"

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
      {path: '/public/newShop', component: newShop},
      {path: '/mt/BusinAnaly', component: BusinAnaly},
      {path: '/mt/newCusManag', component: newCusManag},
      {path: '/mt/shopRank', component: shopRank},
      {path: '/mt/promoSpot', component: promoSpot},
      {path: '/mt/shopSpareas', component: shopSpareas},
      {path: '/mt/category', component: category},
      {path: '/mt/foodAmount', component: foodAmount},
      {path: '/mt/shopActivi', component: shopActivi},
      {path: '/mt/replyRate', component: replyRate},
      {path: '/mt/operating', component: operating},
      {path: '/mt/BusinPassenger', component: BusinPassenger},

    ]
  },
  {path: '*', component: NotFoundView}
]


export default routes

