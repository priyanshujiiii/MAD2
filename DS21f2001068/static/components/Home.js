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
      
      <!-- Banner Image -->
      <div class="banner">
          <img src="/static/images/creator.png" alt="Open Eye Analytics Banner" class="img-fluid" />
        </div>
      <div class="banner">
          <img src="/static/images/sponser.png" alt="Open Eye Analytics Banner" class="img-fluid" />
        </div>
      <!-- Main Content -->

      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
  `,
};

export default Home;

