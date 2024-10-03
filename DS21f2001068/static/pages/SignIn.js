const SignIn = {
    template: `
    <div>
      <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Open Eye Analytics</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <!-- Sign Up Dropdown -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="signupDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sign Up
              </a>
              <div class="dropdown-menu" aria-labelledby="signupDropdown">
                <router-link to="/signup/influencer" class="dropdown-item" href="signin.html">Sign Up as Influencer</router-link>
                <router-link to="/signup/sponsor" class="dropdown-item">Sign Up as Sponsor</router-link>
              </div>
            </li>
            <!-- Sign In and Features Links -->
            <li class="nav-item">
              <router-link to="/signin" class="nav-link">Sign In</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Features</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">

      </div>
      <div class="signin-card">
        <form action="" method="POST"></form>
            <h2 class="text-center">Sign In</h2>
            <div class="form-group">
                <label for="user_role">Role</label>
                <select class="form-control" id="user_role" name="user_role" required>
                    <option value="admin">Admin</option>
                    <option value="influencer">Influencer</option>
                    <option value="sponsor">Sponsor</option>
                </select>
            </div>
            <div class="form-group">
                <label for="user_id">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <button type="submit" class="btn-submit" disabled>Sign In</button>
        </form>
      </div>
      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
    </div>
    `,
  };
  
  export default SignIn;
  