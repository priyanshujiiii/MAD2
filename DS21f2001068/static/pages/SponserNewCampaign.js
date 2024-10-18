const SponserNewCampaign ={
    
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

                    <!-- Additional Links -->
                </ul>
            </div>

            <!-- Right Section for Detail Editing -->
            <div class="col-md-9">
                <div class="container">
                    <div class="row mt-4">
                        <div class="col">
                            <div class="card">
                                <div class="card-header">
                                        <h4>Create New Campaign</h4>
                                    
                                    <div class="card-body">
                                        <form action="" method="POST" enctype="multipart/form-data" id="campaignForm">
                                        <div class="row">
                                            <!-- First Column -->
                                            <div class="col-md-4 form-column">
                                            <div class="form-group">
                                                <label for="campaignName"  style="font-size: 17px;">Campaign Name</label>
                                                <input type="text" class="form-control" id="campaignName" name="campaignName" placeholder="Enter campaign name" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="categories" style="font-size: 17px;">Categories:</label>
                                                <select class="form-control" id="category" name="category">

                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="goals"  style="font-size: 17px;">Goals</label>
                                                <textarea class="form-control" id="goals" name="goals" rows="3" placeholder="Enter campaign goals" required></textarea>
                                            </div>
                                            </div>

                                            <!-- Second Column -->
                                            <div class="col-md-4 form-column">
                                            <div class="form-group">
                                                <label for="campaignDescription"  style="font-size: 17px;">Campaign Description</label>
                                                <textarea class="form-control" id="campaignDescription" name="campaignDescription" rows="3" placeholder="Enter campaign description" required></textarea>
                                            </div>
                                            <div class="form-group">
                                                <label for="startDate"  style="font-size: 17px;">Start Date</label>
                                                <input type="date" class="form-control" id="startDate" name="startDate" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="endDate"  style="font-size: 17px;">End Date</label>
                                                <input type="date" class="form-control" id="endDate" name="endDate" required>
                                            </div>
                                            </div>

                                            <!-- Third Column -->
                                            <div class="col-md-4 form-column">
                                            <div class="form-group">
                                                <label for="budget"  style="font-size: 17px;">Budget</label>
                                                <input type="number" class="form-control" id="budget" name="budget" placeholder="Enter budget" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="visibility"  style="font-size: 17px;">Visibility</label>
                                                <select class="form-control" id="visibility" name="visibility" required>
                                                <option value="Public"  style="font-size: 17px;">Public</option>
                                                <option value="Private"  style="font-size: 17px;">Private</option>
                                                </select>
                                            </div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-block" disabled>Submit</button>
                                        </form>
                                    </div>
                            </div>    </div>
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
            logoutURL: window.location.origin + "/logout"
        };
    },
}
export default SponserNewCampaign;