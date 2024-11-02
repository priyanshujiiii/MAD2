import store from "../utils/store.js";

const InfluencerViewCampaign = {
    data() {
      return {
        logoutURL: `${window.location.origin}/logout`,
        campaigns: [],
        category: this.$route.query.category || '',
        sortDirection: 'highToLow', // Default sort direction
        errorMessage: '' // For displaying errors
      };
    },
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
              <!-- Budget Sorting Dropdown -->
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="budgetDropdownButton" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Budget
                </a>
                <div class="dropdown-menu" aria-labelledby="budgetDropdownButton">
                    <a class="dropdown-item" href="#" @click="sortBudget('highToLow')">Budget high to low</a>
                    <a class="dropdown-item" href="#" @click="sortBudget('lowToHigh')">Budget low to high</a>
                </div>
              </li>
              <li class="nav-item">
                <a :href="logoutURL" class="nav-link">Logout</a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Main Content -->
        <div class="main-content">
          <div class="container">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-for="campaign in campaigns" :key="campaign.campaignid" class="viewcard">
              <div class="viewcard-header">
                <h5 class="viewcard-title">Campaign: {{ campaign.campaignname }}</h5>
              </div>
              <div class="viewcard-body">
                <p><strong>Category:</strong> {{ campaign.category }}</p>
                <p><strong>Goals:</strong> {{ campaign.goals }}</p>
                <p><strong>Description:</strong> {{ campaign.campaign_description }}</p>
                <p><strong>Start Date:</strong> {{ campaign.start_date }}</p>
                <p><strong>End Date:</strong> {{ campaign.end_date }}</p>
                <p><strong>Visibility:</strong> {{ campaign.visibility }}</p>
                <p><strong>Budget:</strong> {{ campaign.budget }}</p>

                <!-- Campaign Action Buttons -->
                <button v-if="campaign.flag === 1" class="btn btn-secondary" disabled>This ad is flagged</button>
                <button v-else-if="campaign.alloted === 1" class="btn btn-secondary" disabled>Influencer hired</button>
                <button v-else @click="sendRequest(campaign.campaignid,campaign.category )" class="btn btn-primary">Send Request</button>
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
  
    mounted() {
      this.loadCampaigns();
    },
  
    methods: {
      async loadCampaigns() {
        // Fetch campaigns based on category
        try {
          const response = await fetch('/oeanalytics/campaign', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: this.category })
          });
          const data = await response.json();
          if (response.ok) {
            this.campaigns = data;
            this.sortBudget(this.sortDirection); // Initial sorting
          } else {
            this.errorMessage = 'Failed to load campaigns';
          }
        } catch (error) {
          this.errorMessage = 'Error fetching campaigns';
        }
      },
      
      // Sort campaigns by budget in high-to-low or low-to-high order
      sortBudget(direction) {
        this.sortDirection = direction;
        if (direction === 'highToLow') {
          this.campaigns.sort((a, b) => b.budget - a.budget);
        } else {
          this.campaigns.sort((a, b) => a.budget - b.budget);
        }
      },

      // Send request to sponsor for the campaign
      async sendRequest(campaignId, category) {
        try {
          const response = await fetch('/oeanalytics/request', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaign_id: campaignId, influencer_email: store.state.user })
          });

          if (response.ok) {
            this.$router.push({ 
                path: '/oeanalytics/InfluencerDashboard/Explore/campaign/SendRequest/form',
                query: { campaign_id: campaignId, category: category }
            });
        } else {
            // Show popup if request already exists
            alert('Request already exists for this campaign.');
        }
        
        } catch (error) {
          this.errorMessage = 'Error sending request';
        }
      }
    },
};

export default InfluencerViewCampaign;
