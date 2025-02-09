const AdminEditCategory = {
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
                    <router-link to="/oeanalytics/AdminDashboard/AdminSponserList" class="list-group-item">Sponser list</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminCampaignList" class="list-group-item">Campaign list</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminRequest" class="list-group-item">Request</router-link>
                    <router-link to="/oeanalytics/AdminDashboard/AdminPayments" class="list-group-item">Payments</router-link>
                </ul>
            </div>

            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <div class="form-container container mt-5">
                                <div class="row justify-content-center">
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-header">
                                                <h1 >Edit Category</h1>
                                            </div>
                                            <div class="card-body">
                                                <form @submit.prevent="submitForm" method="PATCH" id="categoryForm">
                                                    <div class="form-group">
                                                        <label for="category" style="font-size: 17px;">Category:</label>
                                                        <input type="text" class="form-control" id="category" v-model="category" required disabled>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="description" style="font-size: 17px;">Description:</label>
                                                        <textarea class="form-control" id="description" v-model="description" rows="3" style="font-size: 17px;" required></textarea>
                                                    </div>
                                                    <button type="submit" class="btn-submit" id="submitBtn" style="font-size: 17px;">Submit</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div> 
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
            category: this.$route.query.category || '',
            description: this.$route.query.description || '',
            logoutURL: window.location.origin + "/logout"
        };
    },
    methods: {
        submitForm() {
            // Make a PATCH request to update the category
            fetch('/oeanalytics/categories', {
                method: 'PATCH',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({
                    category: this.$route.query.category,
                    description: this.description
                }), 
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to the categories list after successful update
                    this.$router.push('/oeanalytics/AdminDashboard/AdminCategoryList');
                } else {
                    return response.json().then(errData => {
                        throw new Error(errData.message || "Failed to update category");
                    });
                }
            })
            .catch(error => {
                console.error("Error updating category:", error);
                alert("There was an error updating the category: " + error.message);
            });
        },
    },
};

export default AdminEditCategory;
