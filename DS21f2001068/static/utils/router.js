import Home from "../components/Home.js";
import SignUpInfluencer from "../pages/SignUpInfluencer.js";
import SignUpSponsor from "../pages/SignUpSponsor.js";
import SignIn from "../pages/SignIn.js";
import SignUp from "../pages/SignUp.js";


const routes = [
  { path: "/oeanalytics", component: Home },
  { path: "/oeanalytics/signup/influencer", component: SignUpInfluencer },
  { path: "/oeanalytics/signup/sponsor", component: SignUpSponsor },
  { path: "/oeanalytics/signin", component: SignIn },
  { path: "/oeanalytics/signup", component: SignUp },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;