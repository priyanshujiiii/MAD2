const SignUp = {
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
            <li class="nav-item">
              <router-link to="/oeanalytics/signin" class="nav-link">Sign In</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/oeanalytics" class="nav-link">Home</router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">
        <div class="signin-box">
          <form @submit.prevent="submitInfo">
            <h2 class="text-center">Sign Up</h2>
            <div class="form-group">
              <label for="role">Role</label>
              <select v-model="role" class="form-control" id="role" required>
                <option value="influ">Influencer</option>
                <option value="spon">Sponsor</option>
              </select>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" v-model="email" class="form-control" id="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" v-model="password" class="form-control" id="password" required>
            </div>
            <div class="form-group">
              <label for="confirm_password">Confirm Password</label>
              <input type="password" v-model="confirmPassword" class="form-control" id="confirm_password" required>
            </div>
            <button type="submit" class="btn-submit" :disabled="loading">{{ loading ? 'Submitting...' : 'Sign Up' }}</button>
            <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
          </form>
        </div>
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
      confirmPassword: '',
      role: '',
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    validateForm() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return false;
      }
      return true;
    },
    async submitInfo() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await fetch(`${window.location.origin}/Signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            role: this.role,
          }),
          credentials: "same-origin",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          this.$router.push("/oeanalytics/signin");
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || "Sign up failed. Please try again.";
        }
      } catch (error) {
        this.errorMessage = "An error occurred. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  }
};

export default SignUp;
