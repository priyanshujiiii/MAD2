const InfluencerExplore = {
  data() {
    return {
      categories: [], // Fetched categories and their counts
      searchQuery: '', // Search query to filter categories
      logoutURL: `${window.location.origin}/logout`
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
            <li class="nav-item">
              <router-link to="/oeanalytics/InfluencerDashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <a :href="logoutURL" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
      
      <!-- Hero Section -->
      <div class="hero-section">
        <h1>Welcome to Open Eye Analytics</h1>
        <p>Your trusted partner in data-driven insights and solutions.</p>
        <a>Get Started</a>
      </div>
      
      <!-- Search and Category Section -->
      <div class="container">
        <h2 class="section-title">Explore Categories</h2>
        
        <!-- Search Input Field -->
        <div class="form-group">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by category name">
        </div>
        
        <div class="row">
          <div class="col-md-4" v-for="category in filteredCategories" :key="category.category">
            <div class="category-card">
              <h3>{{ category.category }}</h3>
              <p>Number of campaigns: {{ category.count }}</p>
              <!-- View Campaigns Button -->
              <button 
                @click="viewCampaigns(category.category)" 
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

  computed: {
    // Computed property to filter categories based on search query
    filteredCategories() {
      return this.categories.filter(category =>
        category.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  mounted() {
    this.fetchCategories();
  },

  methods: {
    async fetchCategories() {
      try {
        const response = await fetch('/oeanalytics/categories', {
          method: 'PUT',
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: {}
        });
        if (response.ok) {
          const data = await response.json();
          this.categories = data; // Assuming data is in the format [{ category: "Category Name", count: number }]
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    // Method to navigate to the campaigns page for a specific category
    viewCampaigns(category) {
      this.$router.push({ 
        path: '/oeanalytics/InfluencerDashboard/Explore/campaign',
        query: { category }
      });
    },
  },
};

export default InfluencerExplore;
