import store from "../utils/store.js";
const SponserNewCampaign = {
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
                <h1>Create New Campaign</h1>
                    <div class="row mt-4">
                        <div class="col">
                            <div class="card">
                                <div class="card-body">
                                    <form @submit.prevent="submitCampaign" id="campaignForm">
                                        <div class="row">
                                            <!-- First Column -->
                                            <div class="col-md-4 form-column">
                                                <div class="form-group">
                                                    <label for="campaignName" style="font-size: 17px;">Campaign Name</label>
                                                    <input type="text" class="form-control" id="campaignName" v-model="campaign.campaignname" placeholder="Enter campaign name" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="categories" style="font-size: 17px;">Categories:</label>
                                                    <select class="form-control" id="category" v-model="campaign.category" required>
                                                        <option v-for="category in categories" :key="category.category" :value="category.category">{{ category.category }}</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="goals" style="font-size: 17px;">Goals</label>
                                                    <textarea class="form-control" id="goals" v-model="campaign.goals" rows="3" placeholder="Enter campaign goals" required></textarea>
                                                </div>
                                            </div>

                                            <!-- Second Column -->
                                            <div class="col-md-4 form-column">
                                                <div class="form-group">
                                                    <label for="campaignDescription" style="font-size: 17px;">Campaign Description</label>
                                                    <textarea class="form-control" id="campaignDescription" v-model="campaign.campaign_description" rows="3" placeholder="Enter campaign description" required></textarea>
                                                </div>
                                                <div class="form-group">
                                                    <label for="startDate" style="font-size: 17px;">Start Date</label>
                                                    <input type="date" class="form-control" id="startDate" v-model="campaign.start_date" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="endDate" style="font-size: 17px;">End Date</label>
                                                    <input type="date" class="form-control" id="endDate" v-model="campaign.end_date" required>
                                                </div>
                                            </div>

                                            <!-- Third Column -->
                                            <div class="col-md-4 form-column">
                                                <div class="form-group">
                                                    <label for="budget" style="font-size: 17px;">Budget</label>
                                                    <input type="number" class="form-control" id="budget" v-model="campaign.budget" placeholder="Enter budget" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="visibility" style="font-size: 17px;">Visibility</label>
                                                    <select class="form-control" id="visibility" v-model="campaign.visibility" required>
                                                        <option value="Public">Public</option>
                                                        <option value="Private">Private</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-block">Submit</button>
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
            categories: [],
            campaign: {
                campaignname: '',
                category: '',
                goals: '',
                email: '', // Add the sponser email here
                campaign_description: '',
                start_date: '',
                end_date: '',
                visibility: 'Public',
                budget: 0,
                flag: 0,
                alloted: 0,
                payment: 0
            },
            logoutURL: window.location.origin + "/logout"
        };
    },
    mounted() {
        // Fetch categories when the component is mounted
        this.fetchCategories();
    },
    methods: {
        fetchCategories() {
            fetch('/oeanalytics/categories', {
                method: 'GET',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
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
            this.campaign.email = store.state.user; // Change this to the actual sponsor's email

            fetch('/oeanalytics/campaign', {
                method: 'POST',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                  },
                body: JSON.stringify(this.campaign),
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to the sponsor's My Campaigns page
                    this.$router.push('/oeanalytics/SponserDashboard/SponserMyCampaign');
                } else {
                    console.error('Error submitting campaign:', response);
                }
            })
            .catch(error => {
                console.error('Error submitting campaign:', error);
            });
        }
    }
};

export default SponserNewCampaign;
