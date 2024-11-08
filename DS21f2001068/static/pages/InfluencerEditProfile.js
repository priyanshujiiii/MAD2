import store from "../utils/store.js";
const InfluencerEditProfile = {
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
                    <div class="row">
                        <!-- Column 1 -->
                        <div class="col-md-4 form-section">
                            <div class="form-group">
                                <label for="first_name">First Name</label>
                                <input type="text" v-model="formData.first_name" class="form-control" id="first_name" name="first_name" :placeholder="formData.first_name">
                            </div>
                            <div class="form-group">
                                <label for="last_name">Last Name</label>
                                <input type="text" v-model="formData.last_name" class="form-control" id="last_name" name="last_name" :placeholder="formData.last_name">
                            </div>
                            <div class="form-group">
                                <label for="bio">Bio</label>
                                <input type="text" v-model="formData.bio" class="form-control" id="bio" name="bio" :placeholder="formData.bio">
                            </div>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" v-model="formData.address" class="form-control" id="address" name="address" :placeholder="formData.address">
                            </div>
                            <div class="form-group">
                                <label for="district">District</label>
                                <input type="text" v-model="formData.district" class="form-control" id="district" name="district" :placeholder="formData.district">
                            </div>
                        </div>

                        <!-- Column 2 -->
                        <div class="col-md-4 form-section">
                            <div class="form-group">
                                <label for="state">State</label>
                                <input type="text" v-model="formData.state" class="form-control" id="state" name="state" :placeholder="formData.state">
                            </div>
                            <div class="form-group">
                                <label for="pincode">Pincode</label>
                                <input type="text" v-model="formData.pincode" class="form-control" id="pincode" name="pincode" pattern="\\d{6}" :placeholder="formData.pincode">
                            </div>
                            <div class="form-group">
                                <label for="contact">Contact</label>
                                <input type="text" v-model="formData.contact" class="form-control" id="contact" name="contact" :placeholder="formData.contact">
                            </div>
                            <div class="form-group">
                                <label for="instagram_id">Instagram ID</label>
                                <input type="text" v-model="formData.instagram_id" class="form-control" id="instagram_id" name="instagram_id" :placeholder="formData.instagram_id">
                            </div>
                            <div class="form-group">
                                <label for="linkedin_id">LinkedIn ID</label>
                                <input type="text" v-model="formData.linkedin_id" class="form-control" id="linkedin_id" name="linkedin_id" :placeholder="formData.linkedin_id">
                            </div>
                            <div class="form-group">
                                <label for="facebook_id">Facebook ID</label>
                                <input type="text" v-model="formData.facebook_id" class="form-control" id="facebook_id" name="facebook_id" :placeholder="formData.facebook_id">
                            </div>
                        </div>

                        <!-- Column 3 -->
                        <div class="col-md-4 form-section">
                            <div class="form-group">
                                <label for="x_id">X ID</label>
                                <input type="text" v-model="formData.x_id" class="form-control" id="x_id" name="x_id" :placeholder="formData.x_id">
                            </div>
                            <div class="form-group">
                                <label for="category">Categories</label>
                                <select class="form-control" id="category" v-model="formData.category">
                                    <option v-for="category in categories" :key="category" :value="category.category">{{ category.category }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="insta_f">Instagram Followers</label>
                                <input type="number" v-model="formData.insta_f" class="form-control" id="insta_f" name="insta_f" :placeholder="formData.insta_f">
                            </div>
                            <div class="form-group">
                                <label for="linkedin_f">LinkedIn Followers</label>
                                <input type="number" v-model="formData.linkedin_f" class="form-control" id="linkedin_f" name="linkedin_f" :placeholder="formData.linkedin_f">
                            </div>
                            <div class="form-group">
                                <label for="facebook_f">Facebook Followers</label>
                                <input type="number" v-model="formData.facebook_f" class="form-control" id="facebook_f" name="facebook_f" :placeholder="formData.facebook_f">
                            </div>
                            <div class="form-group">
                                <label for="x_f">X Followers</label>
                                <input type="number" v-model="formData.x_f" class="form-control" id="x_f" name="x_f" :placeholder="formData.x_f">
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn-submit">Update</button>
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
            formData: {
                first_name: '',
                last_name: '',
                bio: '',
                address: '',
                district: '',
                state: '',
                pincode: '',
                contact: '',
                instagram_id: '',
                linkedin_id: '',
                facebook_id: '',
                x_id: '',
                category: '',
                insta_f: '',
                linkedin_f: '',
                facebook_f: '',
                x_f: ''
            },
            categories: [], // This will be populated with categories
        };
    },
    methods: {
        fetchProfileData() {
            fetch('/oeanalytics/influencer', {
                method: 'PUT',
                headers: {
                    'Authentication-Token': sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: store.state.user }),
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    this.formData = data[0];
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
                if (Array.isArray(data)) {
                    this.categories = data; // Populate categories array
                } else {
                    console.error("Invalid category data format", data);
                }
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
        },
        submitForm() {
            fetch('/oeanalytics/influencer', {
                method: 'PATCH',
                headers: {
                    'Authentication-Token': sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Profile updated successfully');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
        }
    },
    created() {
        this.fetchProfileData();
        this.fetchCategories(); // Fetch categories when component is created
    }
};
export default InfluencerEditProfile;
