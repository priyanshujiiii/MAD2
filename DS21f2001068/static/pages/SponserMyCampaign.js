import store from "../utils/store.js";

const SponserMyCampaign = {
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
                        <router-link to="/oeanalytics/SponserDashboard" class="nav-link">Dashboard</router-link>
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-link nav-link" @click.prevent="handleLogout">Logout</button>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="main-content">
            <!-- Left Sidebar with Options -->
            <div class="sidebar col-md-2">
                <h3 class="mt-4 mb-4 text-center">Sponser Dashboard</h3>
                <ul class="list-group">
                    <router-link to="/oeanalytics/SponserDashboard/SponserMyCampaign" class="list-group-item">My Campaign</router-link>
                    <router-link to="/oeanalytics/SponserDashboard/SponserNewCampaign" class="list-group-item">New Campaign</router-link>
                    <router-link to="/oeanalytics/SponserDashboard/SponserIncoming" class="list-group-item">Incoming Ad Request</router-link>
                    <router-link to="/oeanalytics/SponserDashboard/SponserOutgoing" class="list-group-item">Outgoing Ad Request</router-link>
                    <router-link to="/oeanalytics/SponserDashboard/SponserPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Campaign Table -->
            <div class="col-md-9">
                <h1>My Campaigns</h1>
                <div class="table__body">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Campaign ID</th>
                                <th>Campaign Name</th>
                                <th>Category</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Visibility</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Alloted</th>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th>View</th>
                                <th>Send Request</th>
                                <th>Contract</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="campaign in campaigns" :key="campaign.campaignid">
                                <td>{{ campaign.campaignid }}</td>
                                <td>{{ campaign.campaignname }}</td>
                                <td>{{ campaign.category }}</td>
                                <td>{{ campaign.start_date }}</td>
                                <td>{{ campaign.end_date }}</td>
                                <td>{{ campaign.visibility }}</td>
                                <td>{{ campaign.budget }}</td>
                                <!-- Status Column -->
                                <td>
                                    <span :style="{ color: campaign.flag === 1 ? 'red' : 'green' }">
                                        {{ campaign.flag === 1 ? 'Banned' : 'Open' }}
                                    </span>
                                </td>
                                <!-- Alloted Column -->
                                <td>{{ campaign.alloted === 1 ? 'Hired' : 'Pending' }}</td>
                                <!-- Buttons -->
                                <td><button class="btn btn-warning" @click="editCampaign(campaign)" :disabled="campaign.flag === 1 || campaign.alloted === 1">Edit</button></td>
                                <td><button class="btn btn-danger" @click="deleteCampaign(campaign.campaignid)" :disabled="campaign.flag === 1 || campaign.alloted === 1">Delete</button></td>
                                <td><button class="btn btn-info" @click="viewCampaign(campaign.campaignid)" :disabled="campaign.flag === 1 ">View</button></td>
                                <td><button class="btn btn-info" @click="hire(campaign.campaignid)" :disabled="campaign.flag === 1 || campaign.alloted === 1">Hire</button></td>
                                <td><button class="btn btn-secondary" @click="downloadPDF(campaign.campaignid)" :disabled="campaign.alloted !== 1">View Contract</button></td>
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
            campaigns: [] // Array to store the campaign data
        };
    },
    methods: {
        // Fetch campaigns from API when component is mounted
        fetchCampaigns() {
            fetch("/oeanalytics/campaign", {
                method: "PUT",
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: store.state.user, role: 'spon' })
            })
            .then(response => response.json())
            .then(data => {
                this.campaigns = data; // Assign fetched campaigns to the data array
            })
            .catch(error => {
                console.error("Error fetching campaigns:", error);
            });
        },
        // Edit campaign
        editCampaign(item) {
            this.$router.push({ 
                path: '/oeanalytics/SponserDashboard/SponserEditCampaign', 
                query: { item: item } 
            });
        },
        // Delete campaign
        deleteCampaign(campaignId) {
            fetch('/oeanalytics/campaign', {
                method: 'DELETE',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ campaignid: campaignId })
            })
            .then(response => response.json())
            .then(() => {
                this.fetchCampaigns(); // Refresh the campaigns
            })
            .catch(error => {
                console.error("Error deleting Campaigns:", error);
                alert("There was an error deleting the Campaigns: " + error.message);
            });
        },
        hire(campaignId) {
            this.$router.push({ 
                path: '/oeanalytics/SponserDashboard/SponserMyCampaign/hire', 
                query: { campaign: JSON.stringify(campaignId) } 
            });
        },
        handleLogout() {
            store.commit('logout');
            fetch("/logout", {
                method: "POST",
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                }
            })
            .then(() => {
                this.$router.push('/oeanalytics');
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
        },
        // View campaign
        viewCampaign(campaignId) {
            this.$router.push({ 
                path: '/oeanalytics/SponserDashboard/SponserMyCampaign/id', 
                query: { id: campaignId } 
            });
        },
        // Download PDF Contract
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
    },
    mounted() {
        // Fetch campaigns when component is mounted
        this.fetchCampaigns();
    }
}
export default SponserMyCampaign;
