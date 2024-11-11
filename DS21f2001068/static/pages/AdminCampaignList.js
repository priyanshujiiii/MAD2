const AdminCampaignList = {
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
                        <router-link to="/oeanalytics/AdminDashboard" class="nav-link">Dashboard</router-link>
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
                <h3 class="mt-4 mb-4 text-center">Admin Dashboard</h3>
                <ul class="list-group">
                    <router-link to="/oeanalytics/AdminDashboard/AdminAddCategory" class="list-group-item">Add Category</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCategoryList" class="list-group-item">Category List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminInfluencerList" class="list-group-item">Influencer List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminSponserList" class="list-group-item">Sponsor List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCampaignList" class="list-group-item">Campaign List</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminRequest" class="list-group-item">Request</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Campaign List Table -->
            <div class="col-md-9">
                <h4>Campaign List</h4>
                <input type="text" v-model="searchQuery" placeholder="Search campaigns..." class="form-control mb-3" />
                <div class="table__body">
                <table class="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Campaign Name</th>
                            <th>Category</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Visibility</th>
                            <th>Budget</th>
                            <th>Alloted</th>
                            <th>Payment</th>
                            <th>Approval</th> <!-- Added column for Approval -->
                            <th>Delete</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="campaign in filteredCampaigns" :key="campaign.campaignid">
                            <td>{{ campaign.campaignid }}</td>
                            <td>{{ campaign.campaignname }}</td>
                            <td>{{ campaign.category }}</td>
                            <td>{{ campaign.start_date }}</td>
                            <td>{{ campaign.end_date }}</td>
                            <td>{{ campaign.visibility }}</td>
                            <td>{{ campaign.budget }}</td>
                            <td>{{ campaign.alloted === 1 ? 'Hired' : 'Pending' }}</td>
                            <td>{{ campaign.payment === 1 ? 'Paid' : 'Pending' }}</td>
                            <td>
                                <!-- Show Approval Status and Approve Button -->
                                <span>{{ campaign.approval === 0 ? 'Approval Pending' : 'Approved' }}</span>
                                <button 
                                    v-if="campaign.approval === 0" 
                                    @click="approveCampaign(campaign.campaignid)" 
                                    class="btn btn-success mt-2">
                                    Approve
                                </button>
                                <button 
                                    v-if="campaign.approval === 1" 
                                    class="btn btn-success mt-2" 
                                    disabled>
                                    Approved
                                </button>
                            </td>
                            <td>
                                <button 
                                    @click="deleteCampaign(campaign.campaignid)" 
                                    class="btn btn-danger" 
                                    :disabled="campaign.alloted === 1">
                                    Delete
                                </button>
                            </td>
                            <td>
                                <button 
                                    @click="toggleFlag(campaign.campaignid, campaign.flag)" 
                                    class="btn btn-warning" 
                                    :disabled="campaign.alloted === 1">
                                    {{ campaign.flag === 0 ? 'Flag' : 'Unflag' }}
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
            campaigns: [], // Array to hold campaign data
            searchQuery: '' // String to hold the search query
        };
    },
    created() {
        // Fetch campaign data when component is created
        this.fetchCampaigns();
    },
    computed: {
        // Filter campaigns based on search query
        filteredCampaigns() {
            return this.campaigns.filter(campaign => {
                return (
                    campaign.campaignname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    campaign.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    campaign.goals.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    campaign.email.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        }
    },
    methods: {
        // Fetch all campaigns
        fetchCampaigns() {
            fetch('/oeanalytics/campaign', { 
                method: 'GET' ,
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.campaigns = data;
                })
                .catch(error => console.error('Error fetching campaigns:', error));
        },

        // Delete a campaign
        deleteCampaign(campaignid) {
            fetch('/oeanalytics/campaign', {
                method: 'DELETE',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ campaign_id: campaignid })
            })
            .then(response => {
                if (response.ok) {
                    this.campaigns = this.campaigns.filter(campaign => campaign.campaignid !== campaignid);
                } else {
                    console.error('Error deleting campaign');
                }
            });
        },

        // Toggle flag status of a campaign
        toggleFlag(campaignid, currentFlag) {
            const newFlag = currentFlag === 0 ? 1 : 0;
            fetch('/oeanalytics/campaign', {
                method: 'PATCH',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ campaign_id: campaignid, flag: newFlag })
            })
            .then(response => {
                if (response.ok) {
                    this.campaigns = this.campaigns.map(campaign => {
                        if (campaign.campaignid === campaignid) {
                            return { ...campaign, flag: newFlag };
                        }
                        return campaign;
                    });
                } else {
                    console.error('Error updating flag status');
                }
            });
        },

        // Approve a campaign
        approveCampaign(campaignid) {
            fetch('/oeanalytics/campaign', {
                method: 'PATCH',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ campaign_id: campaignid, approval: 1 })
            })
            .then(response => {
                if (response.ok) {
                    this.campaigns = this.campaigns.map(campaign => {
                        if (campaign.campaignid === campaignid) {
                            return { ...campaign, approval: 1 };
                        }
                        return campaign;
                    });
                } else {
                    console.error('Error approving campaign');
                }
            });
        }
    }
};

export default AdminCampaignList;
