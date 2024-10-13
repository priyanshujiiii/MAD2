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
              <!-- Sign Up Dropdown -->
              <li class="nav-item">
                <router-link to="/oeanalytics/signup" class="nav-link">Sign Up</router-link>
              </li>
              <!-- Sign In and Features Links -->
              <li class="nav-item">
                <router-link to="/oeanalytics/signin" class="nav-link">Sign In</router-link>
              </li>
            </ul>
          </div>
        </nav>
  
        <!-- Main Content -->
        <div class="main-content">
          <div class="signin-box">
            <form @submit.prevent="validateForm">
              <h2 class="text-center">Sign Up</h2>
              <div class="form-group">
                <label for="user_role">Role</label>
                <select class="form-control" id="user_role" name="user_role" required>
                  <option value="admin">Admin</option>
                  <option value="influencer">Influencer</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>
              <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
              </div>
              <button type="submit" class="btn-submit">Sign Up</button>
            </form>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
        </div>
      </div>
    `,
  
    methods: {
      validateForm() {
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;
  
        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return false;
        }
  
        // Additional form validation logic can be added here
        
        // If validation passes, you can proceed with form submission
        // For example:
        // this.$router.push('/nextPage');
        alert("Form submitted successfully!");
      }
    }
  };
  
  export default SignUp;
  