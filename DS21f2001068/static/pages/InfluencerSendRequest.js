import store from "../utils/store.js";

const InfluencerSendRequest = {
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

            <!-- Right Section with Form Container -->
            <div align="center">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h4>Send Request</h4>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="sendRequest">
                            <div class="form-group">
                                <label for="Requirements">Requirements</label>
                                <input type="text" class="form-control" id="Requirements" v-model="form.requirements" placeholder="Enter Requirements" required>
                            </div>
                            <div class="form-group">
                                <label for="Message">Message</label>
                                <textarea class="form-control" id="Message" v-model="form.messages" rows="3" placeholder="Enter Message" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="Amount">Amount</label>
                                <input type="text" class="form-control" id="Amount" v-model="form.payment_amount" placeholder="Enter Amount" >
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
                influencer_email: store.state.user, // Populated in mounted hook
                campaign_id: "",      // Populated in mounted hook
                status: 0,
                payment_amount: "",
                requirements: "",
                messages: "",
                role: "influ",
                category: ""          // To be fetched or prefilled if available
            }
        };
    },
    methods: {
        async sendRequest() {
            try {
                const response = await fetch('/oeanalytics/request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form) // Ensure `this.form` is defined and contains the necessary data
                });
        
                if (response.ok) {
                    const category = this.$route.query.category; // Declare `category` with `const` or `let`
                    this.$router.push({ 
                        path: '/oeanalytics/InfluencerDashboard/Explore/campaign',
                        query: { category }
                    });
                } else if (response.status === 400) {
                    alert('Request already exists for this campaign.'); // Show alert if request already exists
                } else {
                    console.error('Failed to send request:', response.statusText); // Handle other error responses
                }
            } catch (error) {
                console.error('Error sending request:', error); // Log any network or other errors
            }
        }
        
    },
    mounted() {
        // Populate the form with dynamic data
        this.form.campaign_id = this.$route.query.campaign_id || "";
    }
    
};

export default InfluencerSendRequest;
