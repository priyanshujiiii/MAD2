<div class="card-header">
    <h4 style="font-size: 20px;">Send Request</h4>
</div>
<div class="card-body">
    <form action="{{ url_for('edit_request_influencer', request_id=requests.request_id) }}" method="POST" enctype="multipart/form-data" id="categoryForm">
        <div class="form-group">
            <label for="Requirements" style="font-size: 17px;">Requirements</label>
            <input type="text" class="form-control" id="Requirements" name="Requirements" value="{{ requests.requirements }}" >
        </div>
        <div class="form-group">
            <label for="Message" style="font-size: 17px;">Message</label>
            <textarea class="form-control" id="Message" name="Message" rows="3"  style="font-size: 17px;">{{ requests.messages }}</textarea>
        </div>
        <div class="form-group">
            <label for="Amount" style="font-size: 17px;">Amount</label>
            <input type="text" class="form-control" id="Amount" name="Amount" value="{{ requests.payment_amount }}" style="font-size: 17px;">
        </div>

        <button type="submit" class="btn btn-primary" id="submitBtn" style="font-size: 17px;">Submit</button>
    </form>
</div>