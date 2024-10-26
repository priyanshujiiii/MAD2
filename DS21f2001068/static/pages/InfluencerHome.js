import store from "../utils/store.js";
// NavBar component
const InfluencerHome = {
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
              <router-link to="/oeanalytics/InfluencerHome/profile" class="nav-link">Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/oeanalytics/InfluencerDashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <a :href="logoutURL" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
      
      <!-- Profile Details -->
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
                <td>First Name</td>
                <td>{{ profileFields.first_name }}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>{{ profileFields.last_name }}</td>
              </tr>
              <tr>
                <td>Bio</td>
                <td>{{ profileFields.bio }}</td>
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
              <tr>
                <td>Instagram ID</td>
                <td>{{ profileFields.instagram_id }}</td>
              </tr>
              <tr>
                <td>LinkedIn ID</td>
                <td>{{ profileFields.linkedin_id }}</td>
              </tr>
              <tr>
                <td>Facebook ID</td>
                <td>{{ profileFields.facebook_id }}</td>
              </tr>
              <tr>
                <td>X ID</td>
                <td>{{ profileFields.x_id }}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td>{{ profileFields.category }}</td>
              </tr>
              <tr>
                <td>Instagram Followers</td>
                <td>{{ profileFields.insta_f }}</td>
              </tr>
              <tr>
                <td>LinkedIn Followers</td>
                <td>{{ profileFields.linkedin_f }}</td>
              </tr>
              <tr>
                <td>Facebook Followers</td>
                <td>{{ profileFields.facebook_f }}</td>
              </tr>
              <tr>
                <td>X Followers</td>
                <td>{{ profileFields.x_f }}</td>
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
      profileFields: {},  // Use an object for holding user details
      logoutURL: `${window.location.origin}/logout`
    };
  },

  methods: {
    async fetchInfluencer() {
      try {
        const response = await fetch('/oeanalytics/influencer', {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: store.state.user }),
        });
    
        if (response.ok) {
          const data = await response.json();
          
          // Check if the response is an array and access the first item
          if (Array.isArray(data) && data.length > 0) {
            this.profileFields = data[0];  // Use the first item in the array
          } else {
            console.error("Unexpected response format:", data);
          }
        } else {
          // Redirect to profile creation if the influencer does not exist
          this.$router.push("/oeanalytics/InfluencerHome/MakeProfile");
        }
      } catch (error) {
        console.error("Error fetching influencer:", error);
        this.$router.push("/oeanalytics/InfluencerHome/MakeProfile");
      }
    }
  },

  // Call fetchInfluencer method when the component is mounted
  mounted() {
    this.fetchInfluencer();
  }
};

export default InfluencerHome;
