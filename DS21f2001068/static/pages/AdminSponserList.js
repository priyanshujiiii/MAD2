const AdminSponserList = {
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

            <!-- Right Section for Sponsor List -->
            <div class="col-md-9">
                <h4>Sponsor List</h4>
                <input type="text" v-model="searchQuery" placeholder="Search sponsors..." class="form-control mb-3" />

                <table class="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Company Name</th>
                            <th>Industry</th>
                            <th>Position</th>
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
                        <tr v-for="sponser in filteredSponsers" :key="sponser.email">
                            <td>{{ sponser.email }}</td>
                            <td>{{ sponser.first_name }}</td>
                            <td>{{ sponser.last_name }}</td>
                            <td>{{ sponser.company_name }}</td>
                            <td>{{ sponser.industry }}</td>
                            <td>{{ sponser.positions }}</td>
                            <td>{{ sponser.contact }}</td>
                            <td>{{ sponser.address }}</td>
                            <td>{{ sponser.district }}</td>
                            <td>{{ sponser.state }}</td>
                            <td>{{ sponser.pincode }}</td>
                            <td>{{ sponser.wallet }}</td>
                            <td>{{ sponser.flag }}</td>
                            <td><button @click="deleteSponser(sponser.email)" class="btn btn-danger">Delete</button></td>
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
            sponsers: [], // Array to hold sponser data
            searchQuery: '' // String to hold the search query
        };
    },
    created() {
        // Fetch sponser data when component is created
        this.fetchSponsers();
    },
    computed: {
        // Filter sponsers based on search query
        filteredSponsers() {
            return this.sponsers.filter(sponser => {
                return (
                    sponser.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    sponser.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    sponser.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    sponser.company_name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        }
    },
    methods: {
        // Fetch all sponsers
        fetchSponsers() {
            fetch('/oeanalytics/sponsor', { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    this.sponsers = data;
                })
                .catch(error => console.error('Error fetching sponsers:', error));
        },

        // Delete a sponser
        deleteSponser(email) {
            fetch('/oeanalytics/sponsor', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => {
                if (response.ok) {
                    this.sponsers = this.sponsers.filter(sponser => sponser.email !== email);
                } else {
                    console.error('Error deleting sponser');
                }
            });
        }
    }
};

export default AdminSponserList;
