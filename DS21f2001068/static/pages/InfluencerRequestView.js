const InfluencerRequestView = {
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

        <div class="main-content">
            <!-- Left Sidebar with Options -->
            <div class="sidebar col-md-2">
                <h3 class="mt-4 mb-4 text-center">Influencer Dashboard</h3>
                <ul class="list-group">
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluencerMyCampaign" class="list-group-item">My Campaign</router-link>
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluencerIncoming" class="list-group-item">Incoming Ad Request</router-link>
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluencerOutgoing" class="list-group-item">Outgoing Ad Request</router-link>
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluenecerPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Detail View -->
            <div class="col-md-9">
                <div class="container mt-4">
                    <h2>Request Details</h2>
                    <div v-if="data" class="card shadow-sm p-4 mb-4">
                        <div class="field mb-3">
                            <strong>Request ID:</strong> <span>{{ data.request_id }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Influencer Email:</strong> <span>{{ data.influencer_email }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Sponsor Email:</strong> <span>{{ data.sponser_email }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Campaign ID:</strong> <span>{{ data.campaign_id }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Campaign Name:</strong> <span>{{ data.campaign_name }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Status:</strong> <span>{{ data.status }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Payment Amount:</strong> <span>{{ data.payment_amount }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Requirements:</strong> <span>{{ data.requirements }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Messages:</strong> <span>{{ data.messages }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Role:</strong> <span>{{ data.role }}</span>
                        </div>
                        <div class="field mb-3">
                            <strong>Category:</strong> <span>{{ data.category }}</span>
                        </div>
                        <!-- Buttons Section -->
                        <div class="d-flex justify-content-end mt-4">
                            <button 
                                v-if="data.status <= 2" 
                                @click="editRequest(data.request_id)" 
                                class="btn btn-primary btn-sm">
                                Edit
                            </button>
                        </div>
                    </div>
                    <div v-else class="text-center p-4">
                        <p>Loading request details...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer text-center mt-4">
            <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
        </div>
    </div>
    `,
    data() {
        return {
            logoutURL: window.location.origin + "/logout",
            data: null // Holds the request data to be displayed
        };
    },
    methods: {
        fetchRequestDetails() {
            // Use PUT method to retrieve request details
            fetch(`/oeanalytics/request`, {
                method: 'PUT',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({ id: this.$route.query.id })
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch request details.");
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    this.data = data[0]; // Assume the data is an array and take the first element
                } else {
                    console.warn("No data found for the given request ID.");
                }
            })
            .catch(error => console.error("Error fetching request details:", error));
        },
        editRequest(requestId) {
            this.$router.push({ 
                path: '/oeanalytics/InfluencerDashboard/InfluencerOutgoing/edit', 
                query: { request_id:requestId } 
            });
        },
        
    },
    mounted() {
        this.fetchRequestDetails(); // Fetch request details when component is mounted
    }
}
export default InfluencerRequestView;
