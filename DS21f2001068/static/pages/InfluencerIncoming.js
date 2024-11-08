import store from "../utils/store.js";
const InfluencerIncoming = {
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
                </ul>
            </div>

            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <h1>Incoming Ad Request</h1>
                            <div class="btn-group" role="group" aria-label="Status Filter">
                                <button @click="filterStatus(null)" class="btn btn-outline-primary">All</button>
                                <button @click="filterStatus(0)" class="btn btn-outline-secondary">Not Responded</button>
                                <button @click="filterStatus(1)" class="btn btn-outline-success">Accepted</button>
                                <button @click="filterStatus(2)" class="btn btn-outline-danger">Rejected</button>
                            </div>
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Request</th>
                                        <th>Sponser Email</th>
                                        <th>Campaign ID</th>
                                        <th>Campaign Name</th>
                                        <th>Payment Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="request in filteredRequests" :key="request.request_id">
                                        <td>{{ request.request_id }}</td>
                                        <td>{{ request.sponser_email }}</td>
                                        <td>{{ request.campaign_id }}</td>
                                        <td>{{ request.campaign_name }}</td>
                                        <td>{{ request.payment_amount }}</td>
                                        <td>{{ getStatusText(request.status) }}</td>
                                        <td>
                                            <button 
                                                v-if="request.status === 0" 
                                                class="btn btn-success btn-sm" 
                                                @click="acceptRequest( request.request_id)"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                v-if="request.status === 0" 
                                                class="btn btn-danger btn-sm" 
                                                @click="rejectRequest( request.request_id)"
                                            >
                                                Reject
                                            </button>
                                            <button 
                                                v-else 
                                                class="btn btn-secondary btn-sm" 
                                                disabled
                                            >
                                                {{ getStatusText(request.status) }}
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
            requests: [], 
            statusFilter: null
        };
    },
    computed: {
        filteredRequests() {
            if (this.statusFilter === null) return this.requests;
            return this.requests.filter(request => request.status === this.statusFilter);
        }
    },
    methods: {
        filterStatus(status) {
            this.statusFilter = status;
        },
        getStatusText(status) {
            const statusText = {
                0: "Not Responded",
                1: "Accepted",
                2: "Rejected",
                3: "Ad Closed",
                4: "Campaign Banned",
                5: "Influencer Banned",
                6: "Sponser Banned"
            };
            
            return statusText[status] || "Unknown";
        },
        async loadRequests() {
            // Method to load requests from API
            try {
                const response = await fetch('/oeanalytics/request',{
                    method:'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": sessionStorage.getItem("token"),
                      },
                    body:JSON.stringify({ email: store.state.user, role: 'influ',actions:'actions' })

                }); // Adjust this URL as needed
                if (response.ok) {
                    this.requests = await response.json();
                } else {
                    console.error('Failed to load requests:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        },
        async acceptRequest(request) {
            // Accept request and update status
            try {
                const response = await fetch(`/oeanalytics/payment`, {
                    method: 'POST',
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({ request: request}) // Accepting request
                });
                if (response.ok) {
                    await this.loadRequests()
                } else {
                    console.error('Failed to accept request:', response.statusText);
                }
            } catch (error) {
                console.error('Error accepting request:', error);
            }
        },
        async rejectRequest(request) {
            // Reject request and update status
            try {
                const response = await fetch(`/oeanalytics/request`, {
                    method: 'PATCH',
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({ request_id: request, status: 2 }) // Rejecting request
                });
                if (response.ok) {
                    await this.loadRequests()
                } else {
                    console.error('Failed to reject request:', response.statusText);
                }
            } catch (error) {
                console.error('Error rejecting request:', error);
            }
        }
    },
    mounted() {
        this.loadRequests(); // Automatically load requests when the component is mounted
    }
}

export default InfluencerIncoming;
