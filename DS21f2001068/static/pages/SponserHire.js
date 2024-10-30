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
                            <table class="table table-bordered">
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
                                    <tr v-for="influencer in influencers" :key="influencer.email">
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
            influencers: []
        };
    },
    methods: {
        fetchInfluencers() {
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
        sendRequest(email) {
            console.log(`Request sent to ${email}`);
            this.$router.push('/dummy-page');
        }
    },
    watch: {
        '$route.query.campaign': 'fetchInfluencers'
    },
    mounted() {
        this.fetchInfluencers();
    }
};
export default SponserHire;
