const SponserHire = {
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
                    <div class="row mt-4">
                        <div class="col">
                            <h1>Hire Influencers</h1>
                            <!-- Search Form -->
                            <form @submit.prevent="applyFilters" class="mb-4">
                                <div class="form-row">
                                    <div class="col-md-4 mb-2">
                                        <input type="text" class="form-control" v-model="search.email" placeholder="Search by email" aria-label="Search by email">
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <input type="text" class="form-control" v-model="search.category" placeholder="Search by Category" aria-label="Search by Category">
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <input type="number" class="form-control" v-model="search.followers" placeholder="Minimum Followers Count" aria-label="Minimum Followers Count">
                                    </div>
                                    <div class="col-md-12 mb-2">
                                        <button type="submit" class="btn btn-primary">Search</button>
                                    </div>
                                </div>
                            </form>

                            <!-- Influencer Table -->
                            <table class="table table-bordered" v-if="filteredInfluencers.length">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Category</th>
                                        <th>Instagram</th>
                                        <th>LinkedIn</th>
                                        <th>Facebook</th>
                                        <th>X</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="influencer in filteredInfluencers" :key="influencer.email">
                                        <td>{{ influencer.email }}</td>
                                        <td>{{ influencer.first_name }}</td>
                                        <td>{{ influencer.last_name }}</td>
                                        <td>{{ influencer.category }}</td>
                                        <td>
                                            <div>{{ influencer.instagram_id }}</div>
                                            <small>{{ influencer.insta_f }} followers</small>
                                        </td>
                                        <td>
                                            <div>{{ influencer.linkedin_id }}</div>
                                            <small>{{ influencer.linkedin_f }} followers</small>
                                        </td>
                                        <td>
                                            <div>{{ influencer.facebook_id }}</div>
                                            <small>{{ influencer.facebook_f }} followers</small>
                                        </td>
                                        <td>
                                            <div>{{ influencer.x_id }}</div>
                                            <small>{{ influencer.x_f }} followers</small>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" @click="sendRequest(influencer.email)">Send Request</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-else>No results found.</p>
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
            influencers: [], // full data of influencers
            search: {
                email: "",
                category: "",
                followers: null
            }
        };
    },
    computed: {
        filteredInfluencers() {
            // Check if all search fields are empty to return the full list
            if (!this.search.email && !this.search.category && !this.search.followers) {
                return this.influencers;
            }
            
            // Apply filters based on search criteria
            return this.influencers.filter(influencer => {
                const matchesEmail = !this.search.email || influencer.email.toLowerCase().includes(this.search.email.toLowerCase());
                const matchesCategory = !this.search.category || influencer.category.toLowerCase().includes(this.search.category.toLowerCase());
                const matchesFollowers = !this.search.followers || 
                    influencer.insta_f >= this.search.followers ||
                    influencer.linkedin_f >= this.search.followers ||
                    influencer.facebook_f >= this.search.followers ||
                    influencer.x_f >= this.search.followers;
                
                return matchesEmail && matchesCategory && matchesFollowers;
            });
        }
    },
    methods: {
        fetchInfluencers() {
            // Simulated fetch from API or use already available data
            fetch('/oeanalytics/influencer', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ campaign_id: this.$route.query.campaign })
            })
            .then(response => response.json())
            .then(data => {
                this.influencers = data;
            })
            .catch(error => {
                console.error("Error fetching influencers:", error);
            });
        },
        applyFilters() {
            // Simply triggering computed properties
        },
        sendRequest(email) {
            this.$router.push({ 
                path: '/oeanalytics/SponserDashboard/SponserSendRequest', 
                query: { email: email, campaign_id: this.$route.query.campaign }
            });
        }
    },
    mounted() {
        this.fetchInfluencers();
    }
};
export default SponserHire;
