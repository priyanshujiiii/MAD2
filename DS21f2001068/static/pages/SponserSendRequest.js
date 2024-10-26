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
                    <router-link to="/oeanalytics/SponserDashboard/SponserSendRequest" class="list-group-item">Send Request</router-link>
                    <router-link to="/oeanalytics/SponserDashboard/SponserPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Influencer Details -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <h1>Send Request to Influencers</h1>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Category</th>
                                        <th>Instagram ID</th>
                                        <th>LinkedIn ID</th>
                                        <th>Facebook ID</th>
                                        <th>X ID</th>
                                        <th>Instagram Followers</th>
                                        <th>LinkedIn Followers</th>
                                        <th>Facebook Followers</th>
                                        <th>X Followers</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="influencer in influencers" :key="influencer.email">
                                        <td>{{ influencer.email }}</td>
                                        <td>{{ influencer.first_name }}</td>
                                        <td>{{ influencer.last_name }}</td>
                                        <td>{{ influencer.category }}</td>
                                        <td>{{ influencer.instagram_id }}</td>
                                        <td>{{ influencer.linkedin_id }}</td>
                                        <td>{{ influencer.facebook_id }}</td>
                                        <td>{{ influencer.x_id }}</td>
                                        <td>{{ influencer.insta_f }}</td>
                                        <td>{{ influencer.linkedin_f }}</td>
                                        <td>{{ influencer.facebook_f }}</td>
                                        <td>{{ influencer.x_f }}</td>
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
            influencers: [] // Array to hold the fetched influencers
        };
    },
    methods: {
        fetchInfluencers() {
            fetch('/oeanalytics/influencer', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                this.influencers = data; // Save the fetched influencers
            })
            .catch(error => {
                console.error("Error fetching influencers:", error);
            });
        },
        sendRequest(email) {
            // Handle sending request to the selected influencer
            console.log(`Request sent to ${email}`);
            // Redirect to a dummy link after sending the request
            this.$router.push('/dummy-page'); // Change this to your actual redirect link
        }
    },
    mounted() {
        // Fetch influencers when the component is mounted
        this.fetchInfluencers();
    }
};

export default SponserSendRequest;
