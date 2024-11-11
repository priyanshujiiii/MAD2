const AdminRequest = {
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
                    <router-link to="/oeanalytics/AdminDashboard/AdminAddCategory" class="list-group-item">Add Category</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCategoryList" class="list-group-item">Category List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminInfluencerList" class="list-group-item">Influencer List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminSponserList" class="list-group-item">Sponser List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCampaignList" class="list-group-item">Campaign List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminRequest" class="list-group-item">Request</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <h1>Requests</h1>
                
                <!-- Filters -->
                <div class="filters mb-3">
                    <input v-model="searchQuery" type="text" placeholder="Search by Influencer, Sponser, Campaign, or Role" class="form-control mb-2"/>
                    <select v-model="statusFilter" @change="filterRequests" class="form-control mb-2">
                        <option value="">All Statuses</option>
                        <option value="0">Not Responded</option>
                        <option value="1">Accepted</option>
                        <option value="2">Rejected</option>
                        <!-- Add more status options as needed -->
                    </select>
                </div>

                <!-- Requests Table -->
                <div class="table__body">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Influencer Email</th>
                            <th>Sponser Email</th>
                            <th>Campaign Id</th>
                            <th>Campaign Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="request in filteredRequests" :key="request.request_id">
                            <td>{{ request.request_id }}</td>
                            <td>{{ request.influencer_email }}</td>
                            <td>{{ request.sponser_email }}</td>
                            <td>{{ request.campaign_id }}</td>
                            <td>{{ request.campaign_name }}</td>
                            <td>{{ request.role }}</td>
                            <td>{{ getStatusText(request.status) }}</td>
                            <td>
                                <button 
                                    class="btn btn-danger btn-sm" 
                                    @click="deleteRequest(request.request_id)"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
            logoutURL: window.location.origin + "/logout",
            requests: [], 
            searchQuery: '',
            statusFilter: ''
        };
    },
    computed: {
        filteredRequests() {
            let result = this.requests;

            // Filter by status if selected
            if (this.statusFilter) {
                result = result.filter(request => request.status.toString() === this.statusFilter);
            }

            // Filter by search query if entered
            if (this.searchQuery) {
                result = result.filter(request => 
                    request.influencer_email.includes(this.searchQuery) ||
                    request.sponser_email.includes(this.searchQuery) ||
                    request.campaign_name.includes(this.searchQuery) ||
                    request.role.includes(this.searchQuery)
                );
            }

            return result;
        }
    },
    methods: {
        getStatusText(status) {
            const statusText = {
                0: "Not Responded",
                1: "Accepted",
                2: "Rejected"
                // Add more status text mappings as needed
            };
            return statusText[status] || "Unknown";
        },
        async loadRequests() {
            try {
                const response = await fetch('/oeanalytics/request', { 
                    method: 'GET',
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),
                      },
                 });
                if (response.ok) {
                    this.requests = await response.json();
                } else {
                    console.error('Failed to load requests:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        },
        async deleteRequest(request_id) {
            try {
                const response = await fetch('/oeanalytics/request', {
                    method: 'DELETE',
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),
                      },
                    body: JSON.stringify({ request_id })
                });
                if (response.ok) {
                    this.requests = this.requests.filter(request => request.request_id !== request_id);
                } else {
                    console.error('Failed to delete request:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting request:', error);
            }
        },
        filterRequests() {
            // This method is called on filter changes to recompute filteredRequests
        }
    },
    mounted() {
        this.loadRequests(); // Automatically load requests when the component is mounted
    }
};

export default AdminRequest;
