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
                <div class="main-contentt">
                    <div class="container viewcard">
                        <h2 class="viewcard-header">Campaign Details</h2>
                        <div class="viewcard-body">
                            <div v-if="campaign">
                                
                                    <p><strong>Campaign ID:</strong> {{ campaign.campaignid }}<p>
                                    <p><strong>Campaign Name:</strong> {{ campaign.campaignname }}<p>
                                    <p><strong>Category:</strong> {{ campaign.category }}<p>
                                    <p><strong>Goals:</strong> {{ campaign.goals }}<p>
                                    <p><strong>Email:</strong> {{ campaign.email }}<p>
                                    <p><strong>Description:</strong> {{ campaign.campaign_description }}<p>
                                    <p><strong>Start Date:</strong> {{ campaign.start_date }}<p>
                                    <p><strong>End Date:</strong> {{ campaign.end_date }}<p>
                                    <p><strong>Visibility:</strong> {{ campaign.visibility }}<p>
                                    <p><strong>Budget:</strong> {{ campaign.budget }}<p>
                                    <p><strong>Alloted:</strong> {{ campaign.alloted }}<p>
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
