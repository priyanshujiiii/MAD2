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
                    <router-link to="/oeanalytics/AdminDashboard/AdminInfluencerList" class="list-group-item">Influencer List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminSponserList" class="list-group-item">Sponser List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCampaignList" class="list-group-item">Campaign List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminRequest" class="list-group-item">Request</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Influencer List -->
            <div class="col-md-9">
                <h4>Influencer List</h4>
                <input type="text" v-model="searchQuery" placeholder="Search influencers..." class="form-control mb-3" />

                <table class="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Instagram ID</th>
                            <th>LinkedIn ID</th>
                            <th>Facebook ID</th>
                            <th>X ID</th>
                            <th>Category</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>District</th>
                            <th>State</th>
                            <th>Pincode</th>
                            <th>Wallet</th>
                            <th>Flag</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="influencer in filteredInfluencers" :key="influencer.email">
                            <td>{{ influencer.email }}</td>
                            <td>{{ influencer.first_name }}</td>
                            <td>{{ influencer.last_name }}</td>
                            <td>{{ influencer.instagram_id }}</td>
                            <td>{{ influencer.linkedin_id }}</td>
                            <td>{{ influencer.facebook_id }}</td>
                            <td>{{ influencer.x_id }}</td>
                            <td>{{ influencer.category }}</td>
                            <td>{{ influencer.contact }}</td>
                            <td>{{ influencer.address }}</td>
                            <td>{{ influencer.district }}</td>
                            <td>{{ influencer.state }}</td>
                            <td>{{ influencer.pincode }}</td>
                            <td>{{ influencer.wallet }}</td>
                            <td>{{ influencer.flag }}</td>
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
                    influencer.instagram_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.linkedin_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.facebook_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    influencer.x_id.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        }
    },
    methods: {
        // Fetch all influencers
        fetchInfluencers() {
            fetch('/oeanalytics/influencer', { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    this.influencers = data;
                })
                .catch(error => console.error('Error fetching influencers:', error));
        },

        // Delete an influencer
        deleteInfluencer(email) {
            fetch('/oeanalytics/influencer', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
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
