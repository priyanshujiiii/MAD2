const InfluencerCampaign = {
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
        <div class="main-content">
            <!-- Sidebar -->
            <div class="sidebar col-md-2">
                <h3 class="mt-4 mb-4 text-center">Influencer Dashboard</h3>
                <ul class="list-group">
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluencerMyCampaign" class="list-group-item">My Campaign</router-link>
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluencerIncoming" class="list-group-item">Incoming Ad Request</router-link>
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluencerOutgoing" class="list-group-item">Outgoing Ad Request</router-link>
                    <router-link to="/oeanalytics/InfluencerDashboard/InfluenecerPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Campaign Details Section -->
            <div class="col-md-9">
                <div class="container mt-4">
                    <h2 class="text-center mb-4">Campaign Details</h2>
                    <div class="card p-4">
                        <div v-if="campaign">
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Campaign ID:</strong> {{ campaign.campaignid }}</div>
                                <div class="col-md-6"><strong>Campaign Name:</strong> {{ campaign.campaignname }}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Category:</strong> {{ campaign.category }}</div>
                                <div class="col-md-6"><strong>Goals:</strong> {{ campaign.goals }}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Email:</strong> {{ campaign.email }}</div>
                                <div class="col-md-6"><strong>Description:</strong> {{ campaign.campaign_description }}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Start Date:</strong> {{ campaign.start_date }}</div>
                                <div class="col-md-6"><strong>End Date:</strong> {{ campaign.end_date }}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Visibility:</strong> {{ campaign.visibility }}</div>
                                <div class="col-md-6"><strong>Budget:</strong> {{ campaign.budget }}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Flag:</strong> {{ campaign.flag }}</div>
                                <div class="col-md-6"><strong>Alloted:</strong> {{ campaign.alloted }}</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6"><strong>Payment:</strong> {{ campaign.payment }}</div>
                            </div>
                        </div>
                        <div v-else>
                            <p>Loading campaign details...</p>
                        </div>
                        
                        
                    </div>
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
            campaign: null,
            logoutURL: window.location.origin + "/logout"
        };
    },
    mounted() {
        this.fetchCampaign();
    },
    methods: {
        fetchCampaign() {
            const campaignId = this.$route.query.id;  // Assuming `id` is passed as query parameter in the route
            fetch('/oeanalytics/campaign', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authentication-Token": sessionStorage.getItem("token"),
                },
                body: JSON.stringify({ id: campaignId })
            })
            .then(response => response.json())
            .then(data => {
                this.campaign = data;
            })
            .catch(error => {
                console.error("Error fetching campaign data:", error);
            });
        },
        
    }
}

export default InfluencerCampaign;
