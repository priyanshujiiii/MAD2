import store from "../utils/store.js";

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
              <router-link to="/oeanalytics/SponserHome/profile" class="nav-link">Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/oeanalytics/SponserDashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <a :href="logoutURL" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="carddd">
        <h1>Profile Details</h1>
        <div class="details-table">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th style="font-size: 17px;">Field</th>
                <th style="font-size: 17px;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Email</td>
                <td>{{ profileFields.email }}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{{ profileFields.first_name }} {{ profileFields.last_name }}</td>
              </tr>
              <tr>
                <td>Bio</td>
                <td>{{ profileFields.bio }}</td>
              </tr>
              <tr>
                <td>Company Name</td>
                <td>{{ profileFields.company_name }}</td>
              </tr>
              <tr>
                <td>Industry</td>
                <td>{{ profileFields.industry }}</td>
              </tr>
              <tr>
                <td>Positions</td>
                <td>{{ profileFields.positions }}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{{ profileFields.address }}</td>
              </tr>
              <tr>
                <td>District</td>
                <td>{{ profileFields.district }}</td>
              </tr>
              <tr>
                <td>State</td>
                <td>{{ profileFields.state }}</td>
              </tr>
              <tr>
                <td>Pincode</td>
                <td>{{ profileFields.pincode }}</td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>{{ profileFields.contact }}</td>
              </tr>
            </tbody>
          </table>
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
      profileFields: [],
      logoutURL: window.location.origin + "/logout"
    };
  },

  methods: {
    async fetchSponser() {
      try {
        const response = await fetch('/oeanalytics/sponsor', {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: store.state.user }),
        });
    
        if (response.ok) {
          const data = await response.json();
          
          // Since the response is an array, access the first item
          if (Array.isArray(data) && data.length > 0) {
            this.profileFields = data[0];  // Use the first item in the array
          } else {
            console.error("Unexpected response format:", data);
          }
        } else {
          // Redirect to profile creation if the sponsor does not exist
          this.$router.push("/oeanalytics/SponserHome/MakeProfile");
        }
      } catch (error) {
        console.error("Error fetching sponsor profile:", error);
        // You may want to show a user-friendly message or log the error
      }
    }
    
  },

  // Call fetchSponser method when the component is mounted
  mounted() {
    this.fetchSponser();
  }
};

export default SponserHome;
