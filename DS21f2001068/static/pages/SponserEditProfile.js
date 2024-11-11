import store from "../utils/store.js";

const SponserEditProfile = {
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
                        <router-link to="/oeanalytics/SponserDashboard" class="nav-link">Dashboard</router-link>
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
                <h3>Edit Sponsor Profile</h3>
                <form @submit.prevent="submitForm" id="signupForm" enctype="multipart/form-data">
                    <div class="container">
                        <!-- Form Columns -->
                        <div class="row">
                            <!-- Column 1 -->
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="first_name">First Name</label>
                                    <input type="text" class="form-control" id="first_name" v-model="form.first_name" :placeholder="existingData.first_name">
                                </div>
                                <div class="form-group">
                                    <label for="last_name">Last Name</label>
                                    <input type="text" class="form-control" id="last_name" v-model="form.last_name" :placeholder="existingData.last_name">
                                </div>
                                <div class="form-group">
                                    <label for="district">District</label>
                                    <input type="text" class="form-control" id="district" v-model="form.district" :placeholder="existingData.district">
                                </div>
                                <div class="form-group">
                                    <label for="state">State</label>
                                    <input type="text" class="form-control" id="state" v-model="form.state" :placeholder="existingData.state">
                                </div>
                            </div>

                            <!-- Column 2 -->
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="pincode">Pincode</label>
                                    <input type="text" class="form-control" id="pincode" v-model="form.pincode" :placeholder="existingData.pincode" pattern="\\d{6}">
                                </div>
                                <div class="form-group">
                                    <label for="bio">Company Bio</label>
                                    <input type="text" class="form-control" id="bio" v-model="form.bio" :placeholder="existingData.bio">
                                </div>
                                <div class="form-group">
                                    <label for="address">Address</label>
                                    <input type="text" class="form-control" id="address" v-model="form.address" :placeholder="existingData.address">
                                </div>
                                <div class="form-group">
                                    <label for="company_name">Company Name</label>
                                    <input type="text" class="form-control" id="company_name" v-model="form.company_name" :placeholder="existingData.company_name">
                                </div>
                            </div>

                            <!-- Column 3 -->
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="industry">Industry</label>
                                    <select class="form-control" id="industry" v-model="form.industry">
                                        <option v-for="category in categories" :value="category.category">{{ category.category }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="positions">Positions</label>
                                    <input type="text" class="form-control" id="positions" v-model="form.positions" :placeholder="existingData.positions">
                                </div>
                                <div class="form-group">
                                    <label for="contact">Contact Number</label>
                                    <input type="text" class="form-control" id="contact" v-model="form.contact" :placeholder="existingData.contact">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn-submit" :disabled="!isFormValid">Update Profile</button>
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
            logoutURL: window.location.origin + "/logout",
            form: {
                first_name: '',
                last_name: '',
                district: '',
                state: '',
                pincode: '',
                bio: '',
                address: '',
                company_name: '',
                industry: '',
                positions: '',
                contact: '',
            },
            existingData: {},
            categories: [], // This should be populated with industry categories as needed
        };
    },
    created() {
        this.fetchSponsorProfile();
        this.fetchCategories();  // Ensure categories are fetched when the component is created
    },
    computed: {
        isFormValid() {
            // Simple form validation logic (add more rules if needed)
            return this.form.first_name && this.form.last_name && this.form.contact;
        }
    },
    methods: {
        fetchSponsorProfile() {
            // Fetch existing sponsor profile data
            fetch('/oeanalytics/sponsor', {
                method: "PUT",
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: store.state.user }),
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    this.existingData = data[0];
                    this.form = { ...data[0] }; // Populate form with fetched data for two-way binding
                }
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
        },
        fetchCategories() {
            fetch("/oeanalytics/categories", {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                this.categories = data; // Populate categories with the fetched data
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
        },
        submitForm() {
            // Use PATCH to update sponsor profile
            fetch('/oeanalytics/sponsor', {
                method: "PATCH",
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.form),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Profile updated successfully!');
                } else {
                    alert('Error updating profile.');
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
        },
    }
};

export default SponserEditProfile;
