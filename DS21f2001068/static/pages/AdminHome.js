const AdminHome = {
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
      
      <!-- Dashboard Heading -->
      <div>
        <!-- Request Status and Payment Distribution Row -->
        <div class="row mt-3 mx-1">
          <!-- Request Status Chart -->
          <div class="col-md-3 mb-4">
            <h2>Request Status Distribution</h2>
            <canvas id="requestStatusChart"></canvas>
          </div>

          <!-- Payments Distribution Chart -->
          <div class="col-md-3 mb-4">
            <h2>Payments Distribution</h2>
            <canvas id="paymentsChart"></canvas>
          </div>

          <!-- Campaign Budget Chart -->
          <div class="col-md-4 col-lg-6 mb-4">
            <h2>Campaigns with Highest Budgets</h2>
            <canvas id="campaignBudgetChart"></canvas>
          </div>

        </div>

        <!-- Social Media Charts Row -->
        <div class="row mt-4">
          <div class="col-md-3 mb-4">
            <h4>Top 5 Instagram Influencers</h4>
            <canvas id="instagramChart"></canvas>
          </div>

          <div class="col-md-3 mb-4">
            <h4>Top 5 LinkedIn Influencers</h4>
            <canvas id="linkedinChart"></canvas>
          </div>

          <div class="col-md-3 mb-4">
            <h4>Top 5 Facebook Influencers</h4>
            <canvas id="facebookChart"></canvas>
          </div>

          <div class="col-md-3 mb-4">
            <h4>Top 5 X Influencers</h4>
            <canvas id="xChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer text-center mt-5">
        <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
      </div>
    </div>
  `,
  data() {
    return {
      logoutURL: window.location.origin + "/logout",
      requestData: [],
      influencerData: [],
      campaignData: [],
      paymentData: [],
      topInfluencersByPlatform: {
        instagram: [],
        linkedin: [],
        facebook: [],
        twitter: []
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    $route(to, from) {
      if (to.path === '/oeanalytics/AdminDashboard') {
        this.fetchData();
      }
    }
  },
  methods: {
    async fetchData() {
      try {
        const headers = {
          "Content-Type": "application/json",
          "Authentication-Token": sessionStorage.getItem("token"),
        };

        const requestResponse = await fetch('/oeanalytics/request', { method: 'GET', headers });
        const influencerResponse = await fetch('/oeanalytics/influencer', { method: 'GET', headers });
        const campaignResponse = await fetch('/oeanalytics/campaign', { method: 'GET', headers });
        const paymentResponse = await fetch('/oeanalytics/payment', { method: 'GET', headers });

        this.requestData = await requestResponse.json();
        this.influencerData = await influencerResponse.json();
        this.campaignData = await campaignResponse.json();
        this.paymentData = await paymentResponse.json();
        
        this.filterTopInfluencers();
        this.initCharts();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    filterTopInfluencers() {
      const platforms = ['instagram', 'linkedin', 'facebook', 'twitter'];
      
      platforms.forEach(platform => {
        this.topInfluencersByPlatform[platform] = this.influencerData
          .sort((a, b) => b[`${platform}_f`] - a[`${platform}_f`])
          .slice(0, 5)
          .map(influencer => ({
            id: influencer.id,
            followers: influencer[`${platform}_f`]
          }));
      });
    },
    initCharts() {
      this.initRequestStatusChart();
      this.initPaymentsChart();
      this.initCampaignBudgetChart();
      this.initSocialMediaCharts();
    },
    initRequestStatusChart() {
      const statuses = {0: "Not Responded", 1: "Accepted", 2: "Rejected", 3: "Ad Closed", 4: "Campaign Banned", 5: "Influencer Banned", 6: "Sponsor Banned"};
      const statusCounts = Object.values(statuses).map((_, status) => this.requestData.filter(req => req.status === status).length);

      new Chart(document.getElementById('requestStatusChart'), {
        type: 'pie',
        data: {
          labels: Object.values(statuses),
          datasets: [{
            data: statusCounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9CCC65', '#FF7043', '#42A5F5', '#AB47BC']
          }]
        }
      });
    },
    initPaymentsChart() {
      // Define the payment statuses
      const paymentStatuses = ['Pending', 'Completed'];
    
      // Count the number of payments with status 0 (pending) and status 1 (completed)
      const paymentCounts = paymentStatuses.map(status => {
        if (status === 'Pending') {
          return this.paymentData.filter(payment => payment.status === 0).length;
        } else if (status === 'Completed') {
          return this.paymentData.filter(payment => payment.status === 1).length;
        }
      });
    
      // Update the chart with the new data
      new Chart(document.getElementById('paymentsChart'), {
        type: 'pie',
        data: {
          labels: paymentStatuses,
          datasets: [{
            data: paymentCounts,
            backgroundColor: ['#FF6384', '#4CAF50'], // Red for pending, Green for completed
          }]
        }
      });
    }
    ,
    initCampaignBudgetChart() {
      const topCampaigns = this.campaignData
        .sort((a, b) => b.budget - a.budget)
        .slice(0, 5);

      new Chart(document.getElementById('campaignBudgetChart'), {
        type: 'bar',
        data: {
          labels: topCampaigns.map(campaign => campaign.campaignname),
          datasets: [{
            label: 'Budget',
            data: topCampaigns.map(campaign => campaign.budget),
            backgroundColor: '#00ff00',
          }]
        }
      });
    },
    initSocialMediaCharts() {
      this.plotTopInfluencers('Instagram', 'instagram_id', 'insta_f', 'instagramChart');
      this.plotTopInfluencers('LinkedIn', 'linkedin_id', 'linkedin_f', 'linkedinChart');
      this.plotTopInfluencers('Facebook', 'facebook_id', 'facebook_f', 'facebookChart');
      this.plotTopInfluencers('X', 'x_id', 'x_f', 'xChart');
    },
    plotTopInfluencers(platformName, idField, followersField, chartId) {
      // Filter and sort data to get the top 5 influencers for the platform
      const topInfluencers = this.influencerData
        .filter(influencer => influencer[followersField] !== null)
        .sort((a, b) => b[followersField] - a[followersField])
        .slice(0, 5);

      // Extract influencer IDs and follower counts for the chart
      const ids = topInfluencers.map(influencer => influencer[idField]);
      const followers = topInfluencers.map(influencer => influencer[followersField]);

      // Create a bar chart
      new Chart(document.getElementById(chartId), {
        type: 'bar',
        data: {
          labels: ids,
          datasets: [{
            label: `${platformName} Followers`,
            data: followers,
            backgroundColor: '#00ff00',
          }]
        }
      });
    }
  }
};

export default AdminHome;
