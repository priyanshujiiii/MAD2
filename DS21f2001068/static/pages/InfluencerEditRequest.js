const InfluencerEditRequest = {
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
                        <a :href="logoutURL" class="nav-link">Logout</a>
                    </li>
                    <li class="nav-item">
                        <router-link to="/oeanalytics/InfluencerDashboard" class="nav-link">Dashboard</router-link>
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

            <!-- Right Section with Form Container -->
            <div class="col-md-9">
                <div class="card shadow-sm " style="width 1000px">
                    <div class="card-header">
                        <h1>Edit Request</h1>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="sendRequest">
                            <div class="form-group">
                                <label for="Requirements">Requirements</label>
                                <input type="text" class="form-control" id="Requirements" v-model="form.requirements" placeholder="Enter Requirements">
                            </div>
                            <div class="form-group">
                                <label for="Message">Message</label>
                                <textarea class="form-control" id="Message" v-model="form.messages" rows="3" placeholder="Enter Message"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="Amount">Amount</label>
                                <input type="text" class="form-control" id="Amount" v-model="form.payment_amount" placeholder="Enter Amount">
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
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
            data: {},
            form: {
                requirements: "",
                messages: "",
                payment_amount: ""
            }
        };
    },
    methods: {
        fetchRequestDetails() {
            fetch(`/oeanalytics/request`, {
                method: 'PUT',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({ id: this.$route.query.request_id })
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch request details.");
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    this.data = data[0]; // Access the first object in the array
                    // Assign data properties to form fields for two-way binding
                    this.form.requirements = this.data.requirements || "";
                    this.form.messages = this.data.messages || "";
                    this.form.payment_amount = this.data.payment_amount || "";
                } else {
                    console.warn("No data found for the given request ID.");
                }
            })
            .catch(error => console.error("Error fetching request details:", error));
        },
        sendRequest() {
            fetch(`/oeanalytics/request`, {
                method: 'PATCH',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
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
                this.$router.push("/oeanalytics/InfluencerDashboard/InfluencerOutgoing");
            })
            .catch(error => console.error("Error updating request:", error));
        }
    },
    mounted() {
        this.fetchRequestDetails(); // Fetch existing details when component is mounted
    }
}
export default InfluencerEditRequest;
