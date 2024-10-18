import Home from "../components/Home.js";
import SignUpInfluencer from "../pages/SignUpInfluencer.js";
import SignUpSponsor from "../pages/SignUpSponsor.js";
import SignIn from "../pages/SignIn.js";
import SignUp from "../pages/SignUp.js";
import SponserHome from "../pages/SponserHome.js";
import AdminHome from "../pages/AdminHome.js";
import InfluencerHome from "../pages/InfluencerHome.js";
import AdminDash from "../components/AdminDash.js";
import InfluencerDash from "../components/Influencerdash.js";
import SponserDash from "../components/SponserDash.js";
import AddCategory from "../pages/AddCategory.js";
import AdminEditCategory from "../pages/AdminEditCategory.js";
import AdminStatistic from "../pages/AdminStatistic.js";
import AdminCategoryList from "../pages/AdminCategoryList.js";
import AdminInfluencerList from "../pages/AdminInfluencerList.js";
import AdminSponserList from "../pages/AdminSponserList.js";
import AdminCampaignList from "../pages/AdminCampaignList.js";
import AdminRequest from "../pages/AdminRequest.js";
import AdminPayments from "../pages/AdminPayments.js";
import InfluencerMyCampaign from "../pages/InfluencerMyCampaign.js";
import InfluencerEditProfile from "../pages/InfluencerEditProfile.js";
import InfluencerIncoming from "../pages/InfluencerIncoming.js";
import InfluencerOutgoing from "../pages/InfluencerOutgoing.js";
import InfluenecerPayments from "../pages/InfluenecerPayments.js";
import SponserMyCampaign from "../pages/SponserMyCampaign.js";
import SponserNewCampaign from "../pages/SponserNewCampaign.js";
import SponserIncoming from "../pages/SponserIncoming.js";
import SponserOutgoing from "../pages/SponserOutgoing.js";
import SponserSendRequest from "../pages/SponserSendRequest.js";
import SponserPayments from "../pages/SponserPayments.js";


const routes = [
  { path: "/oeanalytics", component: Home },
  { path: "/oeanalytics/InfluencerHome/profile", component: SignUpInfluencer },
  { path: "/oeanalytics/SponserHome/profile", component: SignUpSponsor },
  { path: "/oeanalytics/signin", component: SignIn },
  { path: "/oeanalytics/signup", component: SignUp },
  { path: "/oeanalytics/SponserHome", component: SponserHome },
  { path: "/oeanalytics/InfluencerHome", component: InfluencerHome },
  { path: "/oeanalytics/AdminHome", component: AdminHome },
  { path: "/oeanalytics/AdminDashboard", component: AdminDash },
  { path: "/oeanalytics/AdminDashboard/AdminStatistic", component: AdminStatistic},
  { path: "/oeanalytics/AdminDashboard/AdminAddCategory", component: AddCategory },
  { path: "/oeanalytics/AdminDashboard/AdminEditCategory", component: AdminEditCategory },
  { path: "/oeanalytics/AdminDashboard/AdminCategoryList", component: AdminCategoryList },
  { path: "/oeanalytics/AdminDashboard/AdminInfluencerList", component: AdminInfluencerList },
  { path: "/oeanalytics/AdminDashboard/AdminSponserList", component: AdminSponserList },
  { path: "/oeanalytics/AdminDashboard/AdminCampaignList", component: AdminCampaignList },
  { path: "/oeanalytics/AdminDashboard/AdminRequest", component: AdminRequest },
  { path: "/oeanalytics/AdminDashboard/AdminPayments", component: AdminPayments },
  { path: "/oeanalytics/InfluencerDashboard", component: InfluencerDash },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerMyCampaign", component: InfluencerMyCampaign },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerEditProfile", component: InfluencerEditProfile },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerIncoming", component: InfluencerIncoming },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerOutgoing", component: InfluencerOutgoing },
  { path: "/oeanalytics/InfluencerDashboard/InfluenecerPayments", component: InfluenecerPayments },
  { path: "/oeanalytics/SponserDashboard", component: SponserDash },
  { path: "/oeanalytics/SponserDashboard/SponserMyCampaign", component: SponserMyCampaign },
  { path: "/oeanalytics/SponserDashboard/SponserNewCampaign", component: SponserNewCampaign },
  { path: "/oeanalytics/SponserDashboard/SponserIncoming", component: SponserIncoming },
  { path: "/oeanalytics/SponserDashboard/SponserOutgoing", component: SponserOutgoing },
  { path: "/oeanalytics/SponserDashboard/SponserSendRequest", component: SponserSendRequest },
  { path: "/oeanalytics/SponserDashboard/SponserPayments", component: SponserPayments },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;