const SignUpSponsor = {
  template: `
    <div> <!-- Root element wrapping the entire component -->
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#">Open Eye Analytics</a>
      </nav>

      <!-- Main Content -->
      <div class="center-container">
        <div class="signin-card">
          <h3>Sign Up</h3>
          <form @submit.prevent="submitForm" id="signupForm" enctype="multipart/form-data">
            <div class="container">
                <!-- Columns for Form -->
                <div class="row">
                    <!-- Column 1 -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" v-model="form.username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" v-model="form.password" required>
                        </div>
                        <div class="form-group">
                            <label for="first_name">First Name</label>
                            <input type="text" class="form-control" id="first_name" v-model="form.first_name" required>
                        </div>
                        <div class="form-group">
                            <label for="last_name">Last Name</label>
                            <input type="text" class="form-control" id="last_name" v-model="form.last_name" required>
                        </div>
                    </div>

                    <!-- Column 2 -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="address">Address</label>
                            <input type="text" class="form-control" id="address" v-model="form.address" required>
                        </div>
                        <div class="form-group">
                            <label for="district">District</label>
                            <input type="text" class="form-control" id="district" v-model="form.district" required>
                        </div>
                        <div class="form-group">
                            <label for="state">State</label>
                            <input type="text" class="form-control" id="state" v-model="form.state" required>
                        </div>
                        <div class="form-group">
                            <label for="pincode">Pincode</label>
                            <input type="text" class="form-control" id="pincode" v-model="form.pincode" required pattern="\\d{6}">
                        </div>
                        <div class="form-group">
                            <label for="bio">Company Bio</label>
                            <input type="text" class="form-control" id="bio" v-model="form.bio" required>
                        </div>
                    </div>

                    <!-- Column 3 -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="company_name">Company Name</label>
                            <input type="text" class="form-control" id="company_name" v-model="form.company_name" required>
                        </div>
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
                            <label for="contact">Contact (email)</label>
                            <input type="email" class="form-control" id="contact" v-model="form.contact" required>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <button type="submit" class="btn-submit" :disabled="!isFormValid">Signup</button>
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
        username: '',
        password: '',
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
        contact: ''
      },
      categories: [] // Assuming this will be filled with actual industry categories
    };
  },
  computed: {
    isFormValid() {
      return Object.values(this.form).every(field => field.trim() !== '');
    }
  },
  methods: {
    submitForm() {
      // Handle form submission (e.g., make API call)
      console.log('Form submitted', this.form);
    }
  },
  created() {
    // Simulate fetching categories (replace this with actual API call if necessary)
    this.categories = [
      { category: 'Technology' },
      { category: 'Healthcare' },
      { category: 'Finance' },
      { category: 'Education' }
    ];
  }
};

export default SignUpSponsor;
