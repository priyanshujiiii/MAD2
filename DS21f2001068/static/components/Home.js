// NavBar component
const Home = {
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
                <router-link to="/signup/influencer" class="dropdown-item">Sign Up as Influencer</router-link>
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
        <h1 class="animated-header">Welcome to Open Eye Analytics</h1>

        <div class="features-container">
          <div class="feature-card" data-category="Influencer">
            <h3>Influencer Discovery</h3>
            <p>Find the best influencers for your campaign using profile discovery tools and smart filters.</p>
          </div>
          <div class="feature-card" data-category="Sponsor">
            <h3>Campaign Management</h3>
            <p>Manage the entire influencer marketing process, from negotiating contracts to approving content and releasing payments.</p>
          </div>
          <div class="feature-card" data-category="Analytics">
            <h3>Analytics and Reporting</h3>
            <p>Access in-depth analytics to track target audience, campaign performance, conversions, and other important metrics.</p>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
  `,
};

export default Home;

