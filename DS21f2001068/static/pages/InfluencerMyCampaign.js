import store from "../utils/store.js";
const InfluencerMyCampaign = {
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

            <!-- Right Section for Campaign Details -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <h1>My Campaigns</h1>

                            <!-- Campaign Table -->
                            <div class="table__body">
                            <table class="table table-bordered">
                                <thead >
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Email</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Visibility</th>
                                        <th>Budget</th>
                                        <th>Alloted</th>
                                        <th>Payment</th>
                                        <th>Actions</th>
                                        <th>Dowmloads</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="campaign in campaigns" :key="campaign.campaignid">
                                        <td>{{ campaign.campaignid }}</td>
                                        <td>{{ campaign.campaignname }}</td>
                                        <td>{{ campaign.category }}</td>
                                        <td>{{ campaign.email }}</td>
                                        <td>{{ campaign.start_date }}</td>
                                        <td>{{ campaign.end_date }}</td>
                                        <td>{{ campaign.visibility }}</td>
                                        <td>{{ campaign.budget }}</td>
                                        <td>{{ campaign.alloted }}</td>
                                        <td>{{ campaign.payment }}</td>
                                        <td><button @click="viewCampaign(campaign.campaignid)" class="btn btn-primary btn-sm">View</button></td>
                                        <button @click="downloadPDF(campaign.campaignid)">Download PDF</button>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
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
            campaigns: [],  // Store fetched campaign data here
            logoutURL: window.location.origin + "/logout"
        };
    },
    mounted() {
        this.fetchCampaigns();
    },
    methods: {
        fetchCampaigns() {
            
            fetch(`/oeanalytics/campaign`, {
                method: 'PUT',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({ email:store.state.user,role:'influ' })
            })
            .then(response => response.json())
            .then(data => {
                this.campaigns = data;  // Assume data is an array of campaign objects
            })
            .catch(error => console.error('Error fetching campaigns:', error));
        },
        viewCampaign(campaign) {
            this.$router.push({ 
                path: '/oeanalytics/InfluencerDashboard/InfluencerMyCampaign/id', 
                query: { id:campaign } 
            });
        },
        async downloadPDF(id) {
            try {
              // Start the Celery task to generate the PDF
              const response = await fetch("/oeanalytics/contract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id }) // Use actual values
              });
              
              const data = await response.json();
              const taskId = data.task_id;
      
              // Poll for task status until it's ready
              const intervalId = setInterval(async () => {
                const statusResponse = await fetch(`/oeanalytics/download/${taskId}`);
                
                if (statusResponse.status === 200) { // PDF is ready
                  clearInterval(intervalId);
                  // Download the PDF
                  window.location.href = `/oeanalytics/download/${taskId}`;
                } else if (statusResponse.status === 500) {
                  clearInterval(intervalId);
                  alert("Error generating PDF.");
                }
              }, 2000); // Poll every 2 seconds
            } catch (error) {
              console.error("Error initializing PDF download:", error);
            }
          }
    }
}
export default InfluencerMyCampaign;
