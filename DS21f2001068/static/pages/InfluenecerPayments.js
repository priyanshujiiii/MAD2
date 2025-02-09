import store from "../utils/store.js";
const InfluenecerPayments ={
    
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

                    <!-- Additional Links -->
                </ul>
            </div>

            
            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <h1>Payments</h1>
                            <div class="table__body">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Influencer Email</th>
                                        <th>Sponser Email</th>
                                        <th>Campaign ID</th>
                                        <th>Campaign Name</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="payment in payments" :key="payment.id">
                                        <td>{{ payment.id }}</td>
                                        <td>{{ payment.influencer_email }}</td>
                                        <td>{{ payment.sponser_email }}</td>
                                        <td>{{ payment.campaign_id }}</td>
                                        <td>{{ payment.campaign_name }}</td>
                                        <td>{{ payment.amount }}</td>
                                        <td :class="getStatusClass(payment.status)">
                                            {{ getStatusText(payment.status) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
            logoutURL: window.location.origin + "/logout"
        };
    },
    data() {
        return {
            logoutURL: window.location.origin + "/logout",
            payments: []
        };
    },
    methods: {
        async loadPayments() {
            try {
                const response = await fetch(`/oeanalytics/payment`, {
                    method: 'PUT',
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),"Content-Type": "application/json",
                      },
                    body: JSON.stringify({ email: store.state.user,role:'influ' })
                });
                if (response.ok) {
                    this.payments = await response.json();
                } else {
                    console.error('Failed to load payments:', response.statusText);
                }
            } catch (error) {
                console.error('Error loading payments:', error);
            }
        },
        getStatusText(status) {
            return status === 0 ? 'Pending' : 'Accepted';
        },
        getStatusClass(status) {
            return status === 0 ? 'status-pending' : 'status-accepted';
        }
    },
    mounted() {
        this.loadPayments();
    }

}
export default InfluenecerPayments;