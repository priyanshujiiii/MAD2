const SignUpInfluencer = {
  template: `
    <div style="background-image: url('/static/images/home.jpg'); background-size: cover; background-position: center; min-height: 100vh;">
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
                <router-link to="/oeanalytics/signup/influencer" class="dropdown-item" href="signin.html">Sign Up as Influencer</router-link>
                <router-link to="/oeanalytics/signup/sponsor" class="dropdown-item">Sign Up as Sponsor</router-link>
              </div>
            </li>
            <!-- Sign In and Features Links -->
            <li class="nav-item">
              <router-link to="/oeanalytics/signin" class="nav-link">Sign In</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Features</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="center-container">
        <div class="signin-card">
          <h2>Create a Sponsor Account</h2>
          <form id="signupForm">
            <div class="row" size="17px">
              <!-- Column 1 -->
              <div class="col-md-4 form-section">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input type="text" class="form-control" id="username" name="username" required>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" id="password" name="password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter."
                    required>
                </div>
                <div class="form-group">
                  <label for="first_name">First Name</label>
                  <input type="text" class="form-control" id="first_name" name="first_name" required>
                </div>
                <div class="form-group">
                  <label for="last_name">Last Name</label>
                  <input type="text" class="form-control" id="last_name" name="last_name" required>
                </div>
                <div class="form-group">
                  <label for="profile_photo">Bio</label>
                  <input type="text" class="form-control" id="bio" name="bio" required>
                </div>
                <div class="form-group">
                  <label for="address">Address</label>
                  <input type="text" class="form-control" id="address" name="address" required>
                </div>
                <div class="form-group">
                  <label for="district">District</label>
                  <input type="text" class="form-control" id="district" name="district" required>
                </div>
              </div>
              <!-- Column 2 -->
              <div class="col-md-4 form-section">
                <div class="form-group">
                  <label for="state">State</label>
                  <input type="text" class="form-control" id="state" name="state" required>
                </div>
                <div class="form-group">
                  <label for="pincode">Pincode</label>
                  <input type="text" class="form-control" id="pincode" name="pincode"
                    pattern="\\d{6}" title="Pincode must be exactly 6 digits." required>
                </div>
                <div class="form-group">
                  <label for="contact">Contact</label>
                  <input type="text" class="form-control" id="contact" name="contact" required>
                </div>
                <div class="form-group">
                  <label for="instagram_id">Instagram ID</label>
                  <input type="text" class="form-control" id="instagram_id" name="instagram_id" required>
                </div>
                <div class="form-group">
                  <label for="linkedin_id">LinkedIn ID</label>
                  <input type="text" class="form-control" id="linkedin_id" name="linkedin_id" required>
                </div>
                <div class="form-group">
                  <label for="facebook_id">Facebook ID</label>
                  <input type="text" class="form-control" id="facebook_id" name="facebook_id" required>
                </div>
              </div>
              <!-- Column 3 -->
              <div class="col-md-4 form-section">
                <div class="form-group">
                  <label for="x_id">X ID</label>
                  <input type="text" class="form-control" id="x_id" name="x_id" required>
                </div>
                <div class="form-group">
                  <label for="categories" style="font-size: 17px;">Categories:</label>
                  <select class="form-control" id="category" name="category">
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="insta_f">Instagram Followers</label>
                  <input type="number" class="form-control" id="insta_f" name="insta_f" required>
                </div>
                <div class="form-group">
                  <label for="linkedin_f">LinkedIn Followers</label>
                  <input type="number" class="form-control" id="linkedin_f" name="linkedin_f" required>
                </div>
                <div class="form-group">
                  <label for="facebook_f">Facebook Followers</label>
                  <input type="number" class="form-control" id="facebook_f" name="facebook_f" required>
                </div>
                <div class="form-group">
                  <label for="x_f">X Followers</label>
                  <input type="number" class="form-control" id="x_f" name="x_f" required>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn-submit" disabled>Create</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
  `,
};

export default SignUpInfluencer;
