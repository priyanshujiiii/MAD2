import store from "../utils/store.js";

const SponserHome = {
  template: `
    <div  style="background-image: url('/static/images/home.jpg'); background-size: cover; background-position: center; min-height: 100vh;">
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Open Eye Analytics</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <!-- Only show these buttons if sponsor is not banned and alloted is 1 -->
            <li class="nav-item" v-if="!isBanned && isAlloted">
              <router-link to="/oeanalytics/SponserDashboard/EditProfile" class="nav-link">Edit Profile</router-link>
            </li>
            <li class="nav-item" v-if="!isBanned && isAlloted">
              <router-link to="/oeanalytics/SponserDashboard" class="nav-link">Dashboard</router-link>
            </li>
            <!-- Always show the Logout button -->
            <li class="nav-item">
              <a :href="logoutURL" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Show warning if sponsor is banned -->
      <div class="container" v-if="isBanned">
        <div class="alert alert-warning text-center" role="alert">
          <h3>Your account is banned. Please contact support.</h3>
        </div>
      </div>

      <!-- Show verification pending message if alloted is 0 -->
      <div class="container" v-if="!isAlloted && !isBanned">
        <div class="alert alert-info text-center" role="alert">
          <h3>Your account verification is pending.</h3>
        </div>
      </div>

      <!-- Profile Details Card, shown only if not banned and allotted is 1 -->
      <div class="profile-card container my-5" v-if="!isBanned && isAlloted">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">Sponser Profile Details</h2>
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


      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
  `,

  data() {
    return {
      profileFields: {},
      logoutURL: window.location.origin + "/logout",
      isBanned: false, // To track if the sponsor is banned
      isAlloted: true , // To track if the account is alloted (verified)
      firstColumnLabels: ['Email', 'First Name', 'Last Name', 'Bio', 'Address', 'District', 'State', 'Pincode', 'Contact'],
      secondColumnLabels: ['Company Name', 'Industry', 'Positions', 'Wallet Balance', 'Approval Status'],
      firstColumnFields: [],
      secondColumnFields: [],

    };
  },

  methods: {
    async fetchSponser() {
      try {
        const response = await fetch('/oeanalytics/sponsor', {
          method: "PUT",
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: store.state.user }),
        });

        if (response.ok) {
          const data = await response.json();

          // Since the response is an array, access the first item
          if (Array.isArray(data) && data.length > 0) {
            this.profileFields = data[0];  // Use the first item in the array

            // Check if the sponsor is banned (flag == 1)
            this.isBanned = this.profileFields.flag === 1;

            // Check if the sponsor is alloted (account verified)
            this.isAlloted = this.profileFields.approval === 1;

             // Assign values to the fields arrays for display
             this.firstColumnFields = [
              this.profileFields.email, this.profileFields.first_name, this.profileFields.last_name,
              this.profileFields.bio, this.profileFields.address, this.profileFields.district,
              this.profileFields.state
            ];

            this.secondColumnFields = [
              this.profileFields.company_name, this.profileFields.industry, this.profileFields.positions,
              this.profileFields.wallet, this.profileFields.approval === 1 ? "Verified" : "Pending", 
              this.profileFields.pincode, this.profileFields.contact
            ];

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
