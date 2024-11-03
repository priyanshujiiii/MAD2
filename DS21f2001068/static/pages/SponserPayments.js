import store from "../utils/store.js";

const SponserPayments ={
    
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

                    <!-- Additional Links -->
                </ul>
            </div>
           

            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <h1>Payments</h1>
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
                                        <th>Action</th> <!-- New Action Column -->
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
                                        <td>
                                            <button
                                                :disabled="payment.status === 1"
                                                @click="pay(payment.id)"
                                                :class="payment.status === 1 ? 'btn btn-success' : 'btn btn-primary'">
                                                {{ payment.status === 1 ? 'Paid' : 'Pay' }}
                                            </button>
                                        </td>
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
            payments: []
        };
    },
    methods: {
        async loadPayments() {
            try {
                const response = await fetch(`/oeanalytics/payment`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
        },
        async pay(paymentId) {
            try {
                const response = await fetch(`/oeanalytics/payment`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: paymentId,status:1 })
                });
                if (response.ok) {
                    const updatedPayment = await response.json();
                    // Update the local payment status to show it's been paid
                    const paymentIndex = this.payments.findIndex(payment => payment.id === paymentId);
                    if (paymentIndex !== -1) {
                        this.payments[paymentIndex].status = updatedPayment.status;
                    }
                } else {
                    console.error('Failed to update payment status:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating payment status:', error);
            }
        }
    },
    mounted() {
        this.loadPayments();
    }
};

export default SponserPayments;
