import store from "../utils/store.js";

const InfluencerHome = {
  template: `
    <div class="influencer-home" style="background-image: url('/static/images/home.jpg'); background-size: cover; background-position: center; min-height: 100vh;">
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Open Eye Analytics</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <!-- Logout button always visible -->
            <!-- Other buttons hidden if account is banned -->
            <li class="nav-item" v-if="!isBanned">
              <router-link to="/oeanalytics/InfluencerDashboard/Explore" class="nav-link">Active Campaigns</router-link>
            </li>
            <li class="nav-item" v-if="!isBanned">
              <router-link to="/oeanalytics/InfluencerDashboard/InfluencerEditProfile" class="nav-link">Edit Profile</router-link>
            </li>
            <li class="nav-item" v-if="!isBanned">
              <router-link to="/oeanalytics/InfluencerDashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <a :href="logoutURL" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Profile Details Card -->
      <div class="profile-card container my-5" v-if="!isBanned">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">Influencer Profile Details</h2>
          <div class="row">
            <div class="col-md-6">
              <div class="profile-field" v-for="(label, index) in firstColumnLabels" :key="index">
                <strong>{{ label }}</strong>: {{ firstColumnFields[index] || 'Not Provided' }}
              </div>
            </div>
            <div class="col-md-6">
              <div class="profile-field" v-for="(label, index) in secondColumnLabels" :key="index">
                <strong>{{ label }}</strong>: {{ secondColumnFields[index] || 'Not Provided' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning Message when Banned -->
      <div class="container my-5" v-if="isBanned">
        <div class="alert alert-warning text-center" role="alert">
          <h3>Your account is banned. Please contact support.</h3>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer mt-5 text-center">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
  `,
  
  data() {
    return {
      profileFields: {},
      logoutURL: `${window.location.origin}/logout`,
      firstColumnLabels: ['Email', 'First Name', 'Last Name', 'Bio', 'Address', 'District', 'State', 'Pincode', 'Contact'],
      secondColumnLabels: ['Instagram ID', 'LinkedIn ID', 'Facebook ID', 'X ID', 'Category', 'Instagram Followers', 'LinkedIn Followers', 'Facebook Followers', 'X Followers'],
      firstColumnFields: [],
      secondColumnFields: [],
      isBanned: false // To track if the influencer is banned
    };
  },

  methods: {
    async fetchInfluencer() {
      try {
        const response = await fetch('/oeanalytics/influencer', {
          method: "PUT",
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: store.state.user }),
        });
    
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            this.profileFields = data[0];

            // Check if the influencer is banned
            this.isBanned = this.profileFields.flag === 1;

            // Assign values to the fields arrays based on profile data if not banned
            if (!this.isBanned) {
              this.firstColumnFields = [
                this.profileFields.email, this.profileFields.first_name, this.profileFields.last_name,
                this.profileFields.bio, this.profileFields.address, this.profileFields.district,
                this.profileFields.state, this.profileFields.pincode, this.profileFields.contact
              ];

              this.secondColumnFields = [
                this.profileFields.instagram_id, this.profileFields.linkedin_id, this.profileFields.facebook_id,
                this.profileFields.x_id, this.profileFields.category, this.profileFields.insta_f,
                this.profileFields.linkedin_f, this.profileFields.facebook_f, this.profileFields.x_f
              ];
            }
          } else {
            console.error("Unexpected response format:", data);
          }
        } else {
          this.$router.push("/oeanalytics/InfluencerHome/MakeProfile");
        }
      } catch (error) {
        console.error("Error fetching influencer:", error);
        this.$router.push("/oeanalytics/InfluencerHome/MakeProfile");
      }
    }
  },

  mounted() {
    this.fetchInfluencer();
  }
};

export default InfluencerHome;
