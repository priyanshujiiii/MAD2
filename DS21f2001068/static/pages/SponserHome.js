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

      <!-- Profile Details Card, shown only if not banned and alloted is 1 -->
      <div class="carddd" v-if="!isBanned && isAlloted">
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
      logoutURL: window.location.origin + "/logout",
      isBanned: false, // To track if the sponsor is banned
      isAlloted: true  // To track if the account is alloted (verified)
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
