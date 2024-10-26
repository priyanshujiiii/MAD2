import store from "../utils/store.js";

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
            <li class="nav-item">
              <router-link to="/oeanalytics/InfluencerDashboard" class="nav-link">Dashboard</router-link>
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
          <h2>Influencer Profile</h2>
          <form @submit.prevent="submitForm">
            <div class="row" size="17px">
              <!-- Column 1 -->
              <div class="col-md-4 form-section">
                <div class="form-group">
                  <label for="first_name">First Name</label>
                  <input type="text" v-model="formData.first_name" class="form-control" id="first_name" name="first_name" required>
                </div>
                <div class="form-group">
                  <label for="last_name">Last Name</label>
                  <input type="text" v-model="formData.last_name" class="form-control" id="last_name" name="last_name" required>
                </div>
                <div class="form-group">
                  <label for="bio">Bio</label>
                  <input type="text" v-model="formData.bio" class="form-control" id="bio" name="bio" required>
                </div>
                <div class="form-group">
                  <label for="address">Address</label>
                  <input type="text" v-model="formData.address" class="form-control" id="address" name="address" required>
                </div>
                <div class="form-group">
                  <label for="district">District</label>
                  <input type="text" v-model="formData.district" class="form-control" id="district" name="district" required>
                </div>
              </div>
              <!-- Column 2 -->
              <div class="col-md-4 form-section">
                <div class="form-group">
                  <label for="state">State</label>
                  <input type="text" v-model="formData.state" class="form-control" id="state" name="state" required>
                </div>
                <div class="form-group">
                  <label for="pincode">Pincode</label>
                  <input type="text" v-model="formData.pincode" class="form-control" id="pincode" name="pincode" pattern="\\d{6}" title="Pincode must be exactly 6 digits." required>
                </div>
                <div class="form-group">
                  <label for="contact">Contact</label>
                  <input type="text" v-model="formData.contact" class="form-control" id="contact" name="contact" required>
                </div>
                <div class="form-group">
                  <label for="instagram_id">Instagram ID</label>
                  <input type="text" v-model="formData.instagram_id" class="form-control" id="instagram_id" name="instagram_id" required>
                </div>
                <div class="form-group">
                  <label for="linkedin_id">LinkedIn ID</label>
                  <input type="text" v-model="formData.linkedin_id" class="form-control" id="linkedin_id" name="linkedin_id" required>
                </div>
                <div class="form-group">
                  <label for="facebook_id">Facebook ID</label>
                  <input type="text" v-model="formData.facebook_id" class="form-control" id="facebook_id" name="facebook_id" required>
                </div>
              </div>
              <!-- Column 3 -->
              <div class="col-md-4 form-section">
                <div class="form-group">
                  <label for="x_id">X ID</label>
                  <input type="text" v-model="formData.x_id" class="form-control" id="x_id" name="x_id" required>
                </div>
                <div class="form-group">
                  <label for="category" style="font-size: 17px;">Categories:</label>
                  <select class="form-control" id="category" v-model="formData.category" required>
                    <option v-for="category in categories" :key="category.category" :value="category.category">{{ category.category }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="insta_f">Instagram Followers</label>
                  <input type="number" v-model="formData.insta_f" class="form-control" id="insta_f" name="insta_f" required>
                </div>
                <div class="form-group">
                  <label for="linkedin_f">LinkedIn Followers</label>
                  <input type="number" v-model="formData.linkedin_f" class="form-control" id="linkedin_f" name="linkedin_f" required>
                </div>
                <div class="form-group">
                  <label for="facebook_f">Facebook Followers</label>
                  <input type="number" v-model="formData.facebook_f" class="form-control" id="facebook_f" name="facebook_f" required>
                </div>
                <div class="form-group">
                  <label for="x_f">X Followers</label>
                  <input type="number" v-model="formData.x_f" class="form-control" id="x_f" name="x_f" required>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn-submit">Create</button>
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
      logoutURL: `${window.location.origin}/logout`,
      formData: {
        email: store.state.user,
        password: '',
        address: '',
        contact: '',
        district: '',
        state: '',
        pincode: '',
        first_name: '',
        last_name: '',
        instagram_id: '',
        linkedin_id: '',
        facebook_id: '',
        x_id: '',
        category: '',
        insta_f: '',
        linkedin_f: '',
        facebook_f: '',
        x_f: '',
        bio: '',
        flag: 0,
        wallet: 0
      },
      categories: []
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('/oeanalytics/influencer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);
          this.$router.push("/oeanalytics/InfluencerHome");
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData);
          // Show an error message to the user
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., show an error message)
      }
    },
    fetchCategories() {
      fetch("/oeanalytics/categories")
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.categories = data; // Populate categories
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
          // Handle error (e.g., show an error message)
        });
    },
  },
  created() {
    this.fetchCategories(); // Fetch categories when the component is created
  }
};

export default SignUpInfluencer;
