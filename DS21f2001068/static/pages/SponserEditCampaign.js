const SponserEditCampaign = {
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
                        <a :href="logoutURL" class="nav-link">Logout</a>
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

            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <div class="card">
                                <h1>Edit Campaign</h1>
                                <div class="card-body">
                                    <form @submit.prevent="submitCampaign" id="campaignForm">
                                        <div class="row">
                                            <!-- First Column -->
                                            <div class="col-md-4 form-column">
                                                <div class="form-group">
                                                    <label for="campaignName" style="font-size: 17px;">Campaign Name</label>
                                                    <input type="text" class="form-control" id="campaignName" v-model="campaign.campaignname" :placeholder="campaign.campaignname">
                                                </div>
                                                <div class="form-group">
                                                    <label for="categories" style="font-size: 17px;">Categories:</label>
                                                    <select class="form-control" id="category" v-model="campaign.category">
                                                        <option v-for="category in categories" :key="category.category" :value="category.category">{{ category.category }}</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="goals" style="font-size: 17px;">Goals</label>
                                                    <textarea class="form-control" id="goals" v-model="campaign.goals" :placeholder="campaign.goals" rows="3"></textarea>
                                                </div>
                                            </div>

                                            <!-- Second Column -->
                                            <div class="col-md-4 form-column">
                                                <div class="form-group">
                                                    <label for="campaignDescription" style="font-size: 17px;">Campaign Description</label>
                                                    <textarea class="form-control" id="campaignDescription" v-model="campaign.campaign_description" :placeholder="campaign.campaign_description" rows="3"></textarea>
                                                </div>
                                                <div class="form-group">
                                                    <label for="startDate" style="font-size: 17px;">Start Date</label>
                                                    <input type="date" class="form-control" id="startDate" v-model="campaign.start_date">
                                                </div>
                                                <div class="form-group">
                                                    <label for="endDate" style="font-size: 17px;">End Date</label>
                                                    <input type="date" class="form-control" id="endDate" v-model="campaign.end_date">
                                                </div>
                                            </div>

                                            <!-- Third Column -->
                                            <div class="col-md-4 form-column">
                                                <div class="form-group">
                                                    <label for="budget" style="font-size: 17px;">Budget</label>
                                                    <input type="number" class="form-control" id="budget" v-model="campaign.budget" :placeholder="campaign.budget">
                                                </div>
                                                <div class="form-group">
                                                    <label for="visibility" style="font-size: 17px;">Visibility</label>
                                                    <select class="form-control" id="visibility" v-model="campaign.visibility">
                                                        <option value="Public">Public</option>
                                                        <option value="Private">Private</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Update Campaign</button>
                                    </form>
                                </div>
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
            campaign: this.$route.query.item, // Load the campaign data from the query parameters
            categories: [],
            logoutURL: window.location.origin + "/logout"
        };
    },
    mounted() {
        // Fetch categories when the component is mounted
        console.log(this.campaign)
        this.fetchCategories();
    },
    methods: {
        fetchCategories() {
            fetch('/oeanalytics/categories', {
                method: 'GET',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
            })
            .then(response => response.json())
            .then(data => {
                this.categories = data;
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
        },
        submitCampaign() {
            // Add sponsor email to the campaign data
            this.campaign.email = localStorage.getItem("email"); // Ensure sponsor's email is included

            fetch(`/oeanalytics/campaign`, {
                method: 'PATCH',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(this.campaign),
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to the sponsor's My Campaigns page after successful edit
                    this.$router.push('/oeanalytics/SponserDashboard/SponserMyRequest');
                } else {
                    console.error('Error updating campaign:', response);
                }
            })
            .catch(error => {
                console.error('Error updating campaign:', error);
            });
        }
    }
};

export default SponserEditCampaign;
