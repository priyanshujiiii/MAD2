// NavBar component
const SponserHome = {
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
              <li class="nav-item">
                <router-link to="/oeanalytics/SponserDashboard" class="nav-link">Dashboard</router-link>
              </li>
              <li class="nav-item">
                <a :href="logoutURL" class="nav-link">Logout</a>
              </li>
            </ul>
          </div>
        </nav>
        
        <!-- Banner Image -->
        <h1>Welcome to Sponser Home</h1>
  
        <!-- Footer -->
        <div class="footer">
          <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
        </div>
      </div>
    `,
    data() {
      return {
          logoutURL: window.location.origin + "/logout"
      };
    },
  };
  
  export default SponserHome;
  
  