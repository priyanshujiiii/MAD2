import store from "../utils/store.js";
const SignIn = {
  template: `
  <div style="background-image: url('/static/images/home.jpg'); background-size: cover; background-position: center; min-height: 100vh;">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Open Eye Analytics</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <!-- Sign Up Link -->
            <li class="nav-item">
                <router-link to="/oeanalytics/signup" class="nav-link">Sign Up</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/oeanalytics" class="nav-link">Home</router-link>
            </li>
            <!-- Sign In Link -->
          </ul>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content"></div>

    <!-- Sign In Card -->
    <div class="signin-card">
      <form @submit.prevent="signIn">
          <h2 class="text-center">Sign In</h2>
          <div class="form-group">
              <label for="username">Email</label>
              <input v-model="email" type="text" class="form-control" id="email" name="email" required>
          </div>
          <div class="form-group">
              <label for="password">Password</label>
              <input v-model="password" type="password" class="form-control" id="password" name="password" required>
          </div>
          <button type="submit" class="btn-submit" :disabled="!isFormValid" @click="submitInfo">Sign In</button>
      </form>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
    </div>
  </div>
  `,
  data() {
      return {
          email: '',
          password: '',
          logoutURL: window.location.origin + "/logout"
      };
  },
  computed: {
      isFormValid() {
          return this.email && this.password;
      }
  },
  methods: {
    async submitInfo() {
      const url = window.location.origin;
      const res = await fetch(url + "/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password}),
      });

      if (res.ok) {
        const data = await res.json();
        const { role, token, user } = data;
        store.commit('setRole', role);
        store.commit('setAuthToken', token);
        store.commit('setUser', user);
        console.log(data)
        console.log('Role:', store.state.role);       
        console.log('Token:', store.state.authToken); 
        console.log('User:', store.state.user);
        localStorage.setItem("token", token);
        localStorage.setItem("email",user);
        localStorage.setItem("role", role);
        // set role also
      if(data.role=='admin'){
        this.$router.push("/oeanalytics/AdminHome")
      }
      if(data.role=='spon'){
        this.$router.push("/oeanalytics/SponserHome")
      }
      if(data.role=='influ'){
        this.$router.push("/oeanalytics/InfluencerHome")
      } // add logic for inst-dash vs stud
      } else {
        console.error("Login Failed");
      }
    },
  },
};

export default SignIn;
