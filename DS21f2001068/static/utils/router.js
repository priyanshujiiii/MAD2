import Home from "../components/Home.js";
import SignUpInfluencer from "../pages/SignUpInfluencer.js";
import SignUpSponsor from "../pages/SignUpSponsor.js";
import SignIn from "../pages/SignIn.js";


const routes = [
  { path: "/", component: Home },
  { path: "/signup/influencer", component: SignUpInfluencer },
  { path: "/signup/sponsor", component: SignUpSponsor },
  { path: "/signin", component: SignIn },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;