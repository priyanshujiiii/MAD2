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
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <h1>Sponsor My Campaigns</h1>
                            
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style="font-size: 17px;">Campaign ID</th>
                                        <th style="font-size: 17px;">Campaign Name</th>
                                        <th style="font-size: 17px;">Category</th>
                                        <th style="font-size: 17px;">Start Date</th>
                                        <th style="font-size: 17px;">End Date</th>
                                        <th style="font-size: 17px;">Visibility</th>
                                        <th style="font-size: 17px;">Budget</th>
                                        <th style="font-size: 17px;">Edit</th>
                                        <th style="font-size: 17px;">Delete</th>
                                        <th style="font-size: 17px;">View</th>
                                        <th style="font-size: 17px;">Send Request</th>
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
                                        <td><button class="btn btn-warning" @click="editCampaign(campaign)">Edit</button></td>
                                        <td><button class="btn btn-danger" @click="deleteCampaign(campaign.campaignid)">Delete</button></td>
                                        <td><button class="btn btn-info" @click="viewCampaign(campaign.campaignid)">Track</button></td>
                                        <td><button class="btn btn-info" @click="hire(campaign.campaignid)">Hire</button></td>
                                    </tr>
                                </tbody>
                            </table>
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
            logoutURL: window.location.origin + "/logout",
            campaigns: [] // Array to store the campaign data
        };
    },
    methods: {
        // Fetch campaigns from API when component is mounted
        fetchCampaigns() {
            fetch("/oeanalytics/campaign", {
                method: "GET"
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
                query: { item:item } 
            });
        },
        // Delete campaign
        deleteCampaign(campaignId) {
            // Make a DELETE request to the API
            fetch('/oeanalytics/campaign', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({campaignid:campaignId }), // Send the category name
            })
            .then(response => {
                if (response.ok) { // Check if the response status indicates success (2xx)
                    return response.json(); // Convert the response to JSON
                } else {
                    return response.json().then(errData => {
                        // If the response is not ok, throw an error with the message from the server
                        throw new Error(errData.message || "Failed to delete category");
                    });
                }
            })
            .then(data => {
                // Successfully deleted the category, re-fetch the categories
                this.fetchCampaigns(); // Call the method to refresh the categories
            })
            .catch(error => {
                console.error("Error deleting Campaigns:", error);
                alert("There was an error deleting the Campaigns: " + error.message);
            });
        },
        hire(campaign) {
            // Pass the campaign details as query parameters
            this.$router.push({ 
                path: '/oeanalytics/SponserDashboard/SponserMyCampaign/hire', 
                query: { campaign: JSON.stringify(campaign) } 
            });
        },
        
        handleLogout() {
            // Commit the logout mutation to clear user state
            store.commit('logout');
            fetch("/logout", {
                method: "POST"
            })
            .then(() => {
                console.log("error")
                // Redirect user to login or another page
                this.$router.push('/oeanalytics'); // Adjust the route as per your app
              }).catch(err => {
                console.error("Logout error:", err);
              });
          },
        // View campaign
        viewCampaign(campaignId) {
            // Logic to view campaign details (you may redirect to a view page)
            console.log("View campaign", campaignId);
        },
    },
    mounted() {
        // Fetch campaigns when component is mounted
        this.fetchCampaigns();
    }
}
export default SponserMyCampaign;
