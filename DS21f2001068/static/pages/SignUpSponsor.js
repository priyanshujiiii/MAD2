import store from "../utils/store.js";
const SignUpSponsor = {
  template: `
    <div style="background-image: url('/static/images/home.jpg'); background-size: cover; background-position: center; min-height: 100vh;">
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Open Eye Analytics</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link to="/oeanalytics/SponsorDashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <a :href="logoutURL" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="center-container">
        <div class="signin-card1">
          <h3>Create Sponsor Profile</h3>
          <form @submit.prevent="submitForm" id="signupForm" enctype="multipart/form-data">
            <div class="container">
              <!-- Form Columns -->
              <div class="row">
                <!-- Column 1 -->
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" class="form-control" id="first_name" v-model="form.first_name" required>
                  </div>
                  <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" class="form-control" id="last_name" v-model="form.last_name" required>
                  </div>
                  <div class="form-group">
                    <label for="district">District</label>
                    <input type="text" class="form-control" id="district" v-model="form.district" required>
                  </div>
                  <div class="form-group">
                    <label for="state">State</label>
                    <input type="text" class="form-control" id="state" v-model="form.state" required>
                  </div>
                </div>

                <!-- Column 2 -->
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="pincode">Pincode</label>
                    <input type="text" class="form-control" id="pincode" v-model="form.pincode" required pattern="\\d{6}">
                  </div>
                  <div class="form-group">
                    <label for="bio">Company Bio</label>
                    <input type="text" class="form-control" id="bio" v-model="form.bio" required>
                  </div>
                  <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" class="form-control" id="address" v-model="form.address" required>
                  </div>
                  <div class="form-group">
                    <label for="company_name">Company Name</label>
                    <input type="text" class="form-control" id="company_name" v-model="form.company_name" required>
                  </div>
                </div>

                <!-- Column 3 -->
                <div class="col-md-4">
                <div class="form-group">
                    <label for="industry" style="font-size: 17px;">Industry</label>
                    <select class="form-control" id="industry" v-model="form.industry" required>
                      <option v-for="category in categories" :value="category.category">{{ category.category }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="positions">Positions</label>
                    <input type="text" class="form-control" id="positions" v-model="form.positions" required>
                  </div>
                  <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="text" class="form-control" id="contact" v-model="form.contact" required>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn-submit" :disabled="!isFormValid">Create</button>
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
  data() {
    return {
      form: {
        email: store.state.user,
        password: 'hide',
        first_name: '',
        last_name: '',
        address: '',
        district: '',
        state: '',
        pincode: '',
        bio: '',
        company_name: '',
        industry: '',
        positions: '',
        contact: '',
      },
      logoutURL: window.location.origin + "/logout",
      categories: [] // Filled with actual categories from API
    };
  },
  computed: {
    isFormValid() {
      return Object.values(this.form).every(field => field.trim() !== '');
    }
  },
  methods: {
    fetchCategories() {
      fetch("/oeanalytics/categories", {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          this.categories = data; // Populate categories
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });
    },
    submitForm() {
      fetch("/oeanalytics/sponsor", {
        method: "POST",
        headers: {
          "Authentication-Token": sessionStorage.getItem("token"),
          "Content-Type": "application/json",
      },
        body: JSON.stringify(this.form)
      })
        .then(response => {
          if (response.ok) {
            this.$router.push("/oeanalytics/SponserHome");
          }
        })
        .then(data => {
          console.log("Signup successful:", data);
          this.$router.push("/oeanalytics/SponserHome");
          // You can redirect the user to another page or show a success message here
        })
        .catch(error => {
          console.error("Error submitting form:", error);
        });
    }
  },
  created() {
    this.fetchCategories(); // Fetch categories when the component is created
  }
};

export default SignUpSponsor;
