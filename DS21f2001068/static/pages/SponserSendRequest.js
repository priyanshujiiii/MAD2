import store from "../utils/store.js";

const SponserSendRequest = {
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

                <!-- Right Section with Form Container -->
                <div class="col-md-9">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h1>Send Request</h1>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="sendRequest">
                                <div class="form-group">
                                    <label for="Requirements">Requirements</label>
                                    <input type="text" class="form-control" id="Requirements" v-model="form.requirements" required>
                                </div>
                                <div class="form-group">
                                    <label for="Message">Message</label>
                                    <textarea class="form-control" id="Message" v-model="form.messages" rows="3" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
               
            </div>
        </div>

        <!-- Footer -->
        <div class="footer text-center mt-5">
            <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
        </div>
    </div>
    `,
    data() {
        return {
            logoutURL: window.location.origin + "/logout",
            form: {
                influencer_email: "", // Populated in mounted hook
                sponser_email: "",    // Populated in mounted hook
                campaign_id: "",      // Populated in mounted hook
                campaign_name: "",    // To be fetched or prefilled if available
                status: 0,
                payment_amount: "",
                requirements: "",
                messages: "",
                role: "spon",
                category: ""          // To be fetched or prefilled if available
            }
        };
    },
    methods: {
        sendRequest() {
            fetch('/oeanalytics/request', {
                method: 'POST',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(this.form)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to send request.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Request successfully sent:", data);
                // Redirect or show success message as needed
                this.$router.push({ 
                    path: '/oeanalytics/SponserDashboard/SponserMyCampaign/hire', 
                    query: { campaign: this.form.campaign_id } 
                });
            })
            .catch(error => {
                console.error("Error sending request:", error);
                alert("There was an issue submitting the request. Please try again.");
            });
        }
    },
    mounted() {
        // Populate the form with dynamic data
        this.form.influencer_email = this.$route.query.email || "";
        this.form.sponser_email = store.state.user || "";
        this.form.campaign_id = this.$route.query.campaign_id || "";
    }
};

export default SponserSendRequest;
