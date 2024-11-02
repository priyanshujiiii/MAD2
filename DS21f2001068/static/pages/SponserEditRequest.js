import store from "../utils/store.js";

const SponserEditRequest = {
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
                        <h4>Edit Request</h4>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="sendRequest">
                            <div class="form-group">
                                <label for="Requirements">Requirements</label>
                                <input type="text" class="form-control" id="Requirements" v-model="form.requirements" placeholder="Enter Requirements">
                            </div>
                            <div class="form-group">
                                <label for="Message">Message</label>
                                <textarea class="form-control" id="Message" v-model="form.messages" rows="3" placeholder="Enter Message" ></textarea>
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
                requirements: "",
                messages: "",
                payment_amount: ""
            }
        };
    },
    methods: {
        fetchRequestDetails() {
            // Use the PUT method to retrieve existing details
            fetch(`/oeanalytics/request`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: this.$route.query.request_id })
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch request details.");
                return response.json();
            })
            .then(data => {
                // Populate form fields with fetched data
                this.form.requirements = data.requirements || "";
                this.form.messages = data.messages || "";
                this.form.payment_amount = data.payment_amount || "";
            })
            .catch(error => console.error("Error fetching request details:", error));
        },
        sendRequest() {
            // Use PATCH method to update the request details
            fetch(`/oeanalytics/request`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.$route.query.request_id,
                    requirements: this.form.requirements,
                    messages: this.form.messages,
                    payment_amount: this.form.payment_amount
                })
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to update request details.");
                this.$router.push("/oeanalytics/SponserDashboard/SponserOutgoing");
            })
            .catch(error => console.error("Error updating request:", error));
        }
    },
    mounted() {
        this.fetchRequestDetails(); // Fetch existing details when component is mounted
    }
};

export default SponserEditRequest;
