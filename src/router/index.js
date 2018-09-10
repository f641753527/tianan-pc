import Vue from 'vue'
import Router from 'vue-router'
// 用户
import Login from '@/pages/auth/Login';
import Regist from '@/pages/auth/Regist';
import RegistSuccess from '@/pages/auth/RegistSuccess';
import ForgetPass from '@/pages/auth/ForgetPass';
import FindPassSuccess from '@/pages/auth/FindPassSuccess';
// 首页
import Index from '@/pages/index/Index';
// 导航条
import Navigator from '@/pages/navigator/Navigator';

// 配套平台
import ParkCompleteSet from '@/pages/navigator/ParkCompleteSet/ParkCompleteSet';
import Activity from '@/pages/navigator/ParkCompleteSet/CompleteSet/Activity';
import ExclusiveActivities from '@/pages/navigator/ParkCompleteSet/CompleteSet/ExclusiveActivities';
import FoodCourt from '@/pages/navigator/ParkCompleteSet/CompleteSet/FoodCourt';
import SubmitFoods from '@/pages/navigator/ParkCompleteSet/CompleteSet/Submit';
import ActivityDetails from '@/pages/navigator/ParkCompleteSet/CompleteSetdetails/ActivityDetails';
import ExclusiveActivitiesdetails from '@/pages/navigator/ParkCompleteSet/CompleteSetdetails/ExclusiveActivitiesdetails';
import Activityform from '@/pages/navigator/ParkCompleteSet/activityform/Activityform';

// 通知
import Notifications from '@/pages/navigator/notifications/Notifications';
import NotificationList from '@/pages/navigator/notifications/components/List';
import NotificationDetail from '@/pages/navigator/notifications/components/Detail';

// 产品路演
import Production from '@/pages/navigator/productions/Production';
import ProductionList from '@/pages/navigator/productions/components/List';
import ProductionDetail from '@/pages/navigator/productions/components/Detail';

// 物业平台
import Property from '@/pages/navigator/property/Property';

// 商业服务平台
import BusinessPlatform from '@/pages/navigator/businessPlatform/BusinessPlatform';
import BusinessNav from '@/pages/navigator/businessPlatform/child/BusinessNav';
import Recommended from '@/pages/navigator/businessPlatform/child/Recommended';
import MeetingRoom from '@/pages/navigator/businessPlatform/child/MeetingRoom';
import Other from '@/pages/navigator/businessPlatform/child/Other';
import RecommendedDetail from '@/pages/navigator/businessPlatform/child/RecommendedDetail';
import MeetingRoomDetail from '@/pages/navigator/businessPlatform/child/MeetingRoomDetail';
import OtherDetail from '@/pages/navigator/businessPlatform/child/OtherDetail';
import LetMeetingRoom from '@/pages/navigator/businessPlatform/child/LetMeetingRoom';

// 政务服务平台
import GovernmentAffairsPlatform from '@/pages/navigator/governmentAffairsPlatform/GovernmentAffairsPlatform';

// 金融服务平台
import FinancePlatform from '@/pages/navigator/financePlatform/FinancePlatform';
import FinanceList from '@/pages/navigator/financePlatform/child/List';
import FinanceInfo from '@/pages/navigator/financePlatform/child/Info';

// 人力资源
import HumanResource from '@/pages/navigator/humanResource/HumanResource';
import Sort from '@/pages/navigator/humanResource/components/Sort';
import JobDetail from '@/pages/navigator/humanResource/components/JobDetail';
import ServiceDetail from '@/pages/navigator/humanResource/components/ServiceDetail';
import EduDetail from '@/pages/navigator/humanResource/components/EduDetail';

// 支付页面
import Pay from '@/pages/navigator/pay/Pay';
import PaymentPage from '@/pages/navigator/pay/PaymentPage';
import PaySuccess from '@/pages/navigator/pay/PaySuccess';

// 个人中心
import Personal from '@/pages/navigator/personal/Personal';
import PersonalIndex from '@/pages/navigator/personal/components/PersonalIndex';
import UserInfo from '@/pages/navigator/personal/components/info/UserInfo';
import Orders from '@/pages/navigator/personal/components/info/Orders';
import Account from '@/pages/navigator/personal/components/info/Account';
import OrderDetails from '@/pages/navigator/personal/components/details/OrderDetails';
import RightDetail from '@/pages/navigator/personal/components/details/RightsDetail';
import EmailActive from '@/pages/navigator/personal/components/info/child/EmailActive';


// 微社区
import Bbs from '@/pages/navigator/bbs/Bbs';
import BbsNav from '@/pages/navigator/bbs/Nav';
import Cooperation from '@/pages/navigator/bbs/cooperation/Cooperation';
import CooperationDetails from '@/pages/navigator/bbs/cooperation/Details';
import BbsIndex from '@/pages/navigator/bbs/bbs/Index';

// 商城
import Shops from '@/pages/navigator/shops/Index';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/navigator',
    },
    {
      path: '/auth/login',
      component: Login,
    },
    {
      path: '/auth/regist',
      component: Regist,
    },
    {
      path: '/auth/registsuccess',
      component: RegistSuccess,
    },
    {
      path: '/auth/forgetPass',
      component: ForgetPass,
    },
    {
      path: '/auth/findPassSuccess',
      component: FindPassSuccess,
    },
    // 主导航页面
    {
      path: '/navigator',
      component: Navigator,
      children: [
        {
          path: '/',
          redirect: '/index',
        },
        {
          path: '/index',
          component: Index,
        },
        // 园区通知
        {
          path: 'notifications',
          component: Notifications,
          children: [
            {
              path: '/',
              component: NotificationList,
            },
            {
              path: 'detail/:newsId',
              component: NotificationDetail,
            }
          ],
        },
        // 信息交互平台
        {
          path: 'bbs',
          component: Bbs,
          children: [
            {
              path: '/',
              redirect: 'bbsNav'
            },
            {
              path: 'bbsNav',
              component: BbsNav,
              children: [
                {
                  path: '/',
                  redirect: 'cooperation'
                },
                {
                  path: 'cooperation',
                  component: Cooperation,
                },
                {
                  path: 'bbs',
                  component: BbsIndex,
                }
              ]
            },
            {
              path: 'cooperationDetails/:goodsId',
              component: CooperationDetails,
            },
          ]
        },
        // 园区配置平台
        {
          path: 'parkCompleteSet',
          component: ParkCompleteSet,
          children: [
            {
              path: '/',
              redirect: 'activity',
            },
            {
              path: 'activity',
              name: 'activity',
              component: Activity,
            },
            {
              path: 'exclusiveActivities',
              name: 'exclusiveActivities',
              component: ExclusiveActivities,
            },
            {
              path: 'foodCourt',
              name: 'foodCourt',
              component: FoodCourt,
            },
          ],
        },
        // 提交表单
        {
          path: 'submitFoods',
          name: 'submitFoods',
          component: SubmitFoods,
        },
        {
          path: 'activityDetails/:activityId',
          name: 'activityDetails',
          component: ActivityDetails,
        },
        {
          path: 'exclusiveActivitiesdetails/:exclusiveActivitiesdetailsId',
          name: 'exclusiveActivitiesdetails',
          component: ExclusiveActivitiesdetails,
        },
        {
          path: 'activityform/:activityformId',
          component: Activityform,
        },
        // 产品路演
        {
          path: 'production',
          component: Production,
          children: [
            {
              path: '/',
              component: ProductionList,
            },
            {
              path: 'detail/:productionId',
              component: ProductionDetail,
            }
          ],
        },
        // 物业平台
        {
          path: 'property',
          name: 'property',
          component: Property,
        },
        // 商业管理
        {
          path: 'businessPlatform',
          component: BusinessPlatform,
          children: [
            {
              path: '/',
              redirect: 'businessNav',
            },
            {
              path: 'businessNav',
              component: BusinessNav,
              children: [
                {
                  path: 'recommended/:serviceId',
                  component: Recommended,
                },
                {
                  path: 'meetingRoom/:serviceId',
                  component: MeetingRoom,
                },
                {
                  path: 'other/:otherId',
                  component: Other,
                },
              ]
            },
            {
              path: 'recommendedDetail/:itemsId',
              component: RecommendedDetail,
            },
            {
              path: 'meetingRoomDetail/:serviceId/:itemsId',
              component: MeetingRoomDetail,
            },
            {
              path: 'otherDetail/:itemsId',
              component: OtherDetail,
              noMask: true,
            },
            {
              path: 'letMeetingRoom/:serviceId',
              component: LetMeetingRoom,
            },
          ],
        },
        // 政务管理
        {
          path: 'governmentAffairsPlatform',
          component: GovernmentAffairsPlatform,
        },
        // 金融管理
        {
          path: 'financePlatform',
          component: FinancePlatform,
          children: [
            {
              path: '/',
              redirect: 'financeList',
            },
            {
              path: 'financeList',
              component: FinanceList,
            },
            {
              path: 'financeInfo/:goodsId',
              component: FinanceInfo,
            },
          ],
        },
        // 人力资源
         {
          path: 'humanResource',
          component: HumanResource,
          children: [
            {
              path: '/',
              component: Sort,
            },
            {
              path: 'jobDetail/:jobId',
              component: JobDetail,
            },
            {
              path: 'serviceDetail/:serviceId',
              component: ServiceDetail,
            },
            {
              path: 'eduDetail/:eduId',
              component: EduDetail,
            },
          ],
        },
        //  支付页面
        {
          path: 'pay',
          component: Pay,
          children: [
            {
              path: 'paymentPage/:orderid',
              component: PaymentPage,
            },
            {
              path: 'paySuccess',
              component: PaySuccess,
            },
          ]
        },
        // 个人中心
        {
          path: 'personal',
          component: Personal,
          children: [
            {
              path: 'info',
              component: PersonalIndex,
              children: [
                {
                  path: '/',
                  component: UserInfo,
                },
                {
                  path: 'orders',
                  component: Orders,
                },
                {
                  path: 'account',
                  component: Account,
                },
              ],
            },
            {
              path: 'rightsDetail/:type',
              component: RightDetail,
            },
            {
              path: 'orderDetail',
              component: OrderDetails,
            },
          ],
        },
        // 商城
        {
          path: 'shops',
          component: Shops,
        }
      ],
    },
    // 邮箱激活页
    {
      path: '/app/activat/user/info/email',
      component: EmailActive,
    },
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    window.scrollTo(0, 0);
   }
})
