const AdminInfluencerList = {
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
                        <router-link to="/oeanalytics/AdminDashboard" class="nav-link">Dashboard</router-link>
                    </li>
                    <li class="nav-item">
                        <a :href="logoutURL" class="nav-link">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="main-content">
            <!-- Left Sidebar with Options -->
            <div class="sidebar col-md-2">
                <h3 class="mt-4 mb-4 text-center">Admin Dashboard</h3>
                <ul class="list-group">
                    <router-link to="/oeanalytics/AdminDashboard/AdminStatistic" class="list-group-item">Statistics</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminAddCategory" class="list-group-item">Add Category</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCategoryList" class="list-group-item">Category List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminInfluencerList" class="list-group-item active">Influencer List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminSponserList" class="list-group-item">Sponsor List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCampaignList" class="list-group-item">Campaign List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminRequest" class="list-group-item">Request</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Influencer List -->
            <div class="col-md-9">
                <h4>Influencer List</h4>
                <input type="text" v-model="searchQuery" placeholder="Search influencers..." class="form-control mt-4" />

                <table class="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Instagram</th>
                            <th>LinkedIn</th>
                            <th>Facebook</th>
                            <th>X ID</th>
                            <th>Category</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Flag</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="influencer in filteredInfluencers" :key="influencer.email">
                            <td>{{ influencer.email }}</td>
                            <td>{{ influencer.first_name }} {{ influencer.last_name }}</td>

                            <!-- Display social profiles if available -->
                            <td v-if="influencer.instagram_id">
                                <span>{{ influencer.instagram_id }}</span><br>
                                <span>Followers: {{ influencer.insta_f }}</span>
                            </td>
                            <td v-else>-</td>

                            <td v-if="influencer.linkedin_id">
                                <span>{{ influencer.linkedin_id }}</span><br>
                                <span>Connections: {{ influencer.linkedin_f }}</span>
                            </td>
                            <td v-else>-</td>

                            <td v-if="influencer.facebook_id">
                                <span>{{ influencer.facebook_id }}</span><br>
                                <span>Friends: {{ influencer.facebook_f }}</span>
                            </td>
                            <td v-else>-</td>

                            <td v-if="influencer.x_id">
                                <span>{{ influencer.x_id }}</span><br>
                                <span>Followers: {{ influencer.x_f }}</span>
                            </td>
                            <td v-else>-</td>

                            <td>{{ influencer.category }}</td>

                            <!-- Display contact and pincode as integers -->
                            <td>{{ Number(influencer.contact) }}</td>

                            <!-- Consolidated Address Column -->
                            <td>
                                {{ influencer.address }}, 
                                {{ influencer.district }},
                                {{ influencer.state }} - {{ Number(influencer.pincode) }}
                            </td>

                            <!-- Flag Button -->
                            <td>
                                <button @click="toggleFlag(influencer)" class="btn" :class="influencer.flag === 1 ? 'btn-warning' : 'btn-success'">
                                    {{ influencer.flag === 1 ? 'Unflag' : 'Flag' }}
                                </button>
                            </td>

                            <!-- Delete button -->
                            <td><button @click="deleteInfluencer(influencer.email)" class="btn btn-danger">Delete</button></td>
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
            logoutURL: window.location.origin + "/logout",
            influencers: [], // Array to hold influencer data
            searchQuery: '' // String to hold the search query
        };
    },
    created() {
        // Fetch influencer data when component is created
        this.fetchInfluencers();
    },
    computed: {
        // Filter influencers based on search query
        filteredInfluencers() {
            return this.influencers.filter(influencer => {
                return (
                    influencer.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.instagram_id?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.linkedin_id?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.facebook_id?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.x_id?.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        }
    },
    methods: {
        // Fetch all influencers
        fetchInfluencers() {
            fetch('/oeanalytics/influencer', { 
                method: 'GET',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                  },
             })
                .then(response => response.json())
                .then(data => {
                    this.influencers = data;
                })
                .catch(error => console.error('Error fetching influencers:', error));
        },

        // Toggle flag status of an influencer
        toggleFlag(influencer) {
            const newFlagValue = influencer.flag === 1 ? 0 : 1;
            fetch('/oeanalytics/influencer', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": sessionStorage.getItem("token"),
                  },
                body: JSON.stringify({ email: influencer.email, flag: newFlagValue })
            })
            .then(response => {
                if (response.ok) {
                    influencer.flag = newFlagValue;
                } else {
                    console.error('Error updating flag status');
                }
            })
            .catch(error => console.error('Error:', error));
        },

        // Delete an influencer
        deleteInfluencer(email) {
            fetch('/oeanalytics/influencer', {
                method: 'DELETE',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                  },
                body: JSON.stringify({ email })
            })
            .then(response => {
                if (response.ok) {
                    this.influencers = this.influencers.filter(influencer => influencer.email !== email);
                } else {
                    console.error('Error deleting influencer');
                }
            });
        }
    }
};

export default AdminInfluencerList;
