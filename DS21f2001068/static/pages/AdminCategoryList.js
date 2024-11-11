const AdminCategoryList = {
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

            <!-- Right Section for Detail Editing with Scrollable Table -->
            <div class="col-md-9" >
                <h1 class="text-white">Category List</h1>
                
                <!-- Scrollable Table Container -->
                <div class="table__body">
                    <table class="table table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Time</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in category" :key="index">
                                <td>{{ item.category }}</td>
                                <td>{{ item.description }}</td>
                                <td>{{ item.date }}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm table-btn" @click="editCategory(item)">Edit</button>
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-sm table-btn" @click="deleteCategory(item)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer text-center mt-4">
            <p>&copy; 2024 Open Eye Analytics. All rights reserved.</p>
        </div>
    </div>
    `,
    data() {
        return {
            category: [],
            logoutURL: window.location.origin + "/logout"
        };
    },
    mounted() {
        this.fetchCategories(); // Fetch data when the component is mounted
    },
    methods: {
        fetchCategories() {
            fetch("/oeanalytics/categories", {
                method: 'GET',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
            })
            .then(response => response.json())
            .then(data => {
                this.category = data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        },
        editCategory(item) {
            this.$router.push({ 
                path: '/oeanalytics/AdminDashboard/AdminEditCategory', 
                query: { category: item.category, description: item.description } 
            });
        },
        deleteCategory(item) {
            fetch('/oeanalytics/categories', {
                method: 'DELETE',
                headers: {
                    "Authentication-Token": sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({ category: item.category }),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errData => {
                        throw new Error(errData.message || "Failed to delete category");
                    });
                }
            })
            .then(data => {
                this.fetchCategories();
            })
            .catch(error => {
                console.error("Error deleting category:", error);
                alert("There was an error deleting the category: " + error.message);
            });
        },
    }
};

export default AdminCategoryList;
