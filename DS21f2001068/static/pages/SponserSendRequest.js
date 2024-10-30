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

            <!-- Right Section for Influencer Details -->
            <div class="col-md-9">
                <div class="card-header">
                    <h4 style="font-size: 20px;">Send Request</h4>
                </div>
                <div class="card-body">
                    <form @submit.prevent="sendRequest">
                        <div class="form-group">
                            <label for="Requirements" style="font-size: 17px;">Requirements</label>
                            <input type="text" class="form-control" id="Requirements" v-model="form.requirements" required>
                        </div>
                        <div class="form-group">
                            <label for="Message" style="font-size: 17px;">Message</label>
                            <textarea class="form-control" id="Message" v-model="form.messages" rows="3" required style="font-size: 17px;"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="Amount" style="font-size: 17px;">Amount</label>
                            <input type="text" class="form-control" id="Amount" v-model="form.payment_amount" required style="font-size: 17px;">
                        </div>
                        <div class="form-group">
                            <label for="Role" style="font-size: 17px;">Role</label>
                            <input type="text" class="form-control" id="Role" v-model="form.role" required style="font-size: 17px;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="font-size: 17px;">Submit</button>
                    </form>
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
            form: {
                influencer_email: "", // Populate with influencer email when available
                sponser_email: "", // Your sponser email
                campaign_id: "", // Set to the current campaign ID
                campaign_name: "", // Set to the current campaign name
                status: "Pending", // Default status
                payment_amount: "",
                requirements: "",
                messages: "",
                role: "",
                category: "" // Set as needed
            }
        };
    },
    methods: {
        sendRequest() {
            fetch('/oeanalytics/influencer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.form)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Request successfully sent:", data);
                // Redirect or show success message as needed
            })
            .catch(error => {
                console.error("Error sending request:", error);
            });
        }
    },
    mounted() {
        // You can set values for `sponser_email`, `campaign_id`, and other fields here if they're dynamic
    }
};

export default SponserSendRequest;
