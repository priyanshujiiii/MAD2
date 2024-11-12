import store from "../utils/store.js";
const SponserOutgoing = {
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
                            <h1>Outgoing Ad Request</h1>
                            <!-- Status Filter Links -->
                            <div class="btn-group" role="group" aria-label="Status Filter">
                                <button @click="filterStatus(null)" class="btn btn-outline-primary">All</button>
                                <button @click="filterStatus(0)" class="btn btn-outline-secondary">Not Responded</button>
                                <button @click="filterStatus(1)" class="btn btn-outline-success">Accepted</button>
                                <button @click="filterStatus(2)" class="btn btn-outline-danger">Rejected</button>
                            </div>
                            <div class="table__body">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Request</th>
                                        <th>Influencer Email</th>
                                        <th>Campaign ID</th>
                                        <th>Campaign Name</th>
                                        <th>Payment Amount</th>
                                        <th>Requirements</th>
                                        <th>Messages</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="request in filteredRequests" :key="request.request_id">
                                        <td>{{ request.request_id }}</td>
                                        <td>{{ request.influencer_email }}</td>
                                        <td>{{ request.campaign_id }}</td>
                                        <td>{{ request.campaign_name }}</td>
                                        <td>{{ request.payment_amount }}</td>
                                        <td>{{ request.requirements }}</td>
                                        <td>{{ request.messages }}</td>
                                        <td>{{ getStatusText(request.status) }}</td>
                                        <td>
                                            <button 
                                                @click="deleteRequest(request.request_id)" 
                                                :disabled="request.status > 0"
                                                class="btn btn-danger btn-sm">
                                                {{ request.status > 0 ? 'Delete Not Allowed' : 'Delete' }}
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                v-if="request.status < 1" 
                                                @click="editRequest(request.request_id)" 
                                                class="btn btn-primary btn-sm">
                                                Edit
                                            </button>
                                            <button v-else class="btn btn-secondary btn-sm" disabled>
                                                {{ getStatusText(request.status) }}
                                            </button>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
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
        async editRequest(requestId) {
            this.$router.push({ 
                path: '/oeanalytics/SponserDashboard/SponserEditRequest', 
                query: { request_id:requestId } 
            });
        },
        async fetchData() {
            try {
                const response = await fetch("/oeanalytics/request", {
                    method: "PUT",
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),
                        'Content-Type': 'application/json',
                      },
                      
                    body: JSON.stringify({ role: "spon", email: store.state.user })
                });
                const data = await response.json();
                this.requests = data;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        
        async deleteRequest(request_id) {
            try {
                const response = await fetch("/oeanalytics/request", {
                    method: "DELETE",
                    headers: {
                        "Authentication-Token": sessionStorage.getItem("token"),
                        'Content-Type': 'application/json',
                      },
                    'Content-Type': 'application/json',
                    body: JSON.stringify({ request_id })
                });
                const result = await response.json();
                if (result.message === "Request deleted") {
                    this.requests = this.requests.filter(request => request.request_id !== request_id);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        },
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
        }
    },
    mounted() {
        this.fetchData();
    }
};

export default SponserOutgoing;
