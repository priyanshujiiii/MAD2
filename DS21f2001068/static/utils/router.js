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
import InfluencerExplore from "../pages/InfluencerExplore.js";
import InfluencerViewCampaign from "../pages/InfluencerViewCampaign.js";
import InfluencerSendRequest from "../pages/InfluencerSendRequest.js";
import SponserDash from "../components/SponserDash.js";
import AddCategory from "../pages/AddCategory.js";
import AdminEditCategory from "../pages/AdminEditCategory.js";
import AdminCategoryList from "../pages/AdminCategoryList.js";
import AdminInfluencerList from "../pages/AdminInfluencerList.js";
import AdminSponserList from "../pages/AdminSponserList.js";
import AdminCampaignList from "../pages/AdminCampaignList.js";
import AdminRequest from "../pages/AdminRequest.js";
import AdminPayments from "../pages/AdminPayments.js";
import InfluencerMyCampaign from "../pages/InfluencerMyCampaign.js";
import InfluencerCampaign from "../pages/InfluencerCampaign.js";
import InfluencerEditProfile from "../pages/InfluencerEditProfile.js";
import InfluencerIncoming from "../pages/InfluencerIncoming.js";
import InfluencerOutgoing from "../pages/InfluencerOutgoing.js";
import InfluencerEditRequest from "../pages/InfluencerEditRequest.js";
import InfluencerRequestView from "../pages/InfluencerRequestView.js";
import InfluenecerPayments from "../pages/InfluenecerPayments.js";
import SponserMyCampaign from "../pages/SponserMyCampaign.js";
import SponserHire from "../pages/SponserHire.js";
import SponserNewCampaign from "../pages/SponserNewCampaign.js";
import SponserEditCampaign from "../pages/SponserEditCampaign.js";
import SponserIncoming from "../pages/SponserIncoming.js";
import SponserOutgoing from "../pages/SponserOutgoing.js";
import SponserSendRequest from "../pages/SponserSendRequest.js";
import SponserEditRequest from "../pages/SponserEditRequest.js";
import SponserPayments from "../pages/SponserPayments.js";
import SponserView from "../pages/SponserView.js";
import SponserEditProfile from "../pages/SponserEditProfile.js";
import store from "./store.js";

const routes = [
  { path: "/oeanalytics", component: Home },
  { path: "/oeanalytics/signin", component: SignIn },
  { path: "/oeanalytics/signup", component: SignUp },

  { path: "/oeanalytics/AdminHome", component: AdminHome ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard", component: AdminDash,meta: { requiresLogin: true, role: "admin" } },
  { path: "/oeanalytics/AdminDashboard/AdminAddCategory", component: AddCategory ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard/AdminEditCategory", component: AdminEditCategory ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard/AdminCategoryList", component: AdminCategoryList ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard/AdminInfluencerList", component: AdminInfluencerList,meta: { requiresLogin: true, role: "admin" } },
  { path: "/oeanalytics/AdminDashboard/AdminSponserList", component: AdminSponserList ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard/AdminCampaignList", component: AdminCampaignList ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard/AdminRequest", component: AdminRequest ,meta: { requiresLogin: true, role: "admin" }},
  { path: "/oeanalytics/AdminDashboard/AdminPayments", component: AdminPayments ,meta: { requiresLogin: true, role: "admin" }},

  { path: "/oeanalytics/InfluencerHome/MakeProfile", component: SignUpInfluencer,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerHome", component: InfluencerHome,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/Explore", component: InfluencerExplore,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/Explore/campaign", component: InfluencerViewCampaign ,meta: { requiresLogin: true, role: "influ" }},
  { path: "/oeanalytics/InfluencerDashboard/Explore/campaign/SendRequest", component: InfluencerViewCampaign,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/Explore/campaign/SendRequest/form", component: InfluencerSendRequest ,meta: { requiresLogin: true, role: "influ" }},
  { path: "/oeanalytics/InfluencerDashboard", component: InfluencerDash ,meta: { requiresLogin: true, role: "influ" }},
  { path: "/oeanalytics/InfluencerDashboard/InfluencerMyCampaign", component: InfluencerMyCampaign ,meta: { requiresLogin: true, role: "influ" }},
  { path: "/oeanalytics/InfluencerDashboard/InfluencerMyCampaign/id", component: InfluencerCampaign ,meta: { requiresLogin: true, role: "influ" }},
  { path: "/oeanalytics/InfluencerDashboard/InfluencerEditProfile", component: InfluencerEditProfile,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerIncoming", component: InfluencerIncoming,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerOutgoing", component: InfluencerOutgoing,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerOutgoing/edit", component: InfluencerEditRequest,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/InfluencerRequestView", component: InfluencerRequestView,meta: { requiresLogin: true, role: "influ" } },
  { path: "/oeanalytics/InfluencerDashboard/InfluenecerPayments", component: InfluenecerPayments,meta: { requiresLogin: true, role: "influ" } },

  { path: "/oeanalytics/SponserHome/MakeProfile", component: SignUpSponsor,meta: { requiresLogin: true, role: "spon" } },
  { path: "/oeanalytics/SponserHome", component: SponserHome ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard", component: SponserDash ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/EditProfile", component: SponserEditProfile ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserMyCampaign", component: SponserMyCampaign ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserMyCampaign/id", component: SponserView ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserMyCampaign/hire", component: SponserHire ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserNewCampaign", component: SponserNewCampaign ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserEditCampaign", component: SponserEditCampaign ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserIncoming", component: SponserIncoming ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserOutgoing", component: SponserOutgoing ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserSendRequest", component: SponserSendRequest ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserEditRequest", component: SponserEditRequest ,meta: { requiresLogin: true, role: "spon" }},
  { path: "/oeanalytics/SponserDashboard/SponserPayments", component: SponserPayments ,meta: { requiresLogin: true, role: "spon" }},
];

const router = new VueRouter({
  mode: "history",
  routes,
});
// frontend router protection
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresLogin)) {
    if (!store.state.loggedIn) {
      next({ path: "/" });
    } else if (to.meta.role && to.meta.role !== store.state.role) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;