const InfluencerExplore = {
    data() {
      return {
        categories: [], // To store fetched categories and their counts
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
              <!-- Sign Up Dropdown -->
              <li class="nav-item">
                <router-link to="/oeanalytics/signup" class="nav-link">Sign Up</router-link>
              </li>
              <!-- Sign In and Features Links -->
              <li class="nav-item">
                <router-link to="/oeanalytics/signin" class="nav-link">Sign In</router-link>
              </li>
            </ul>
          </div>
        </nav>
        
        <!-- Category Section -->
        <div class="container">
          <h2 class="section-title">Our Categories</h2>
          <div class="row">
            <div class="col-md-4" v-for="(count, category) in categories" :key="category">
              <div class="category-card">
                <h3>{{ category }}</h3>
                <p>Number of campaigns: {{ count }}</p>
                <!-- View Campaigns Button -->
                <button 
                  @click="viewCampaigns(category)" 
                  class="btn btn-primary">
                  View
                </button>
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
      this.fetchCategories();
    },
  
    methods: {
      async fetchCategories() {
        try {
          const response = await fetch('/oeanalytics/categories', {
            method: 'PUT',
            body:{}
          });
          if (response.ok) {
            const data = await response.json();
            this.categories = data; // Assuming the data is in the format { category: count }
          } else {
            console.error('Failed to fetch categories');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      // Method to handle button click and navigate to the campaigns page
      viewCampaigns(category) {
        this.$router.push({ path: '/campaigns', query: { category } });
      },
    },
  };
  
  export default InfluencerExplore;
  