from celery import shared_task
from flask_excel import make_response_from_query_sets
import time
# igonre_resuls mean you dont store the result, where results don't matter
from jinja2 import Template
from weasyprint import HTML
import os
from mail_service import send_email

@shared_task()
def add(x,y):
    time.sleep(10)
    return x+y
@shared_task()
def generate_pdf_task(c, s,i):
    # Query database for sponser details
    campaign = c
    sponsor = s
    influencer = i
    # Render HTML template with sponser details
    html_content = Template("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contract Signed</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f9;
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    text-align: center;
                    color: #004d40;
                    font-size: 2em;
                    margin-bottom: 20px;
                }
                h2 {
                    color: #004d40;
                    border-bottom: 2px solid #004d40;
                    padding-bottom: 5px;
                }
                p, li {
                    color: #555;
                    line-height: 1.6;
                }
                .section {
                    margin-bottom: 20px;
                }
                .field {
                    font-weight: bold;
                    color: #222;
                }
                .terms {
                    font-size: 0.9em;
                    color: #666;
                    line-height: 1.5;
                }
                .terms li {
                    margin-bottom: 8px;
                }
                .signature {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 1.2em;
                    color: #004d40;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Contract Agreement</h1>

                <!-- Sponsor Details -->
                <div class="section">
                    <h2>Sponsor Details</h2>
                    <p><span class="field">Name:</span> {{ sponsor.first_name }} {{ sponsor.last_name }}</p>
                    <p><span class="field">Company:</span> {{ sponsor.company_name }}</p>
                    <p><span class="field">Email:</span> {{ sponsor.email }}</p>
                    <p><span class="field">Contact:</span> {{ sponsor.contact }}</p>
                    <p><span class="field">Address:</span> {{ sponsor.address }}, {{ sponsor.district }}, {{ sponsor.state }} - {{ sponsor.pincode }}</p>
                    <p><span class="field">Industry:</span> {{ sponsor.industry }}</p>
                    <p><span class="field">Position:</span> {{ sponsor.positions }}</p>
                    <p><span class="field">Bio:</span> {{ sponsor.bio }}</p>
                </div>

                <!-- Influencer Details -->
                <div class="section">
                    <h2>Influencer Details</h2>
                    <p><span class="field">Name:</span> {{ influencer.first_name }} {{ influencer.last_name }}</p>
                    <p><span class="field">Email:</span> {{ influencer.email }}</p>
                    <p><span class="field">Contact:</span> {{ influencer.contact }}</p>
                    <p><span class="field">Address:</span> {{ influencer.address }}, {{ influencer.district }}, {{ influencer.state }} - {{ influencer.pincode }}</p>
                    <p><span class="field">Category:</span> {{ influencer.category }}</p>
                    <p><span class="field">Instagram Followers:</span> {{ influencer.insta_f }}</p>
                    <p><span class="field">LinkedIn Followers:</span> {{ influencer.linkedin_f }}</p>
                    <p><span class="field">Facebook Followers:</span> {{ influencer.facebook_f }}</p>
                    <p><span class="field">X (Twitter) Followers:</span> {{ influencer.x_f }}</p>
                    <p><span class="field">Bio:</span> {{ influencer.bio }}</p>
                </div>

                <!-- Campaign Details -->
                <div class="section">
                    <h2>Campaign Details</h2>
                    <p><span class="field">Campaign ID:</span> {{ campaign.campaignid }}</p>
                    <p><span class="field">Campaign Name:</span> {{ campaign.campaignname }}</p>
                    <p><span class="field">Category:</span> {{ campaign.category }}</p>
                    <p><span class="field">Goals:</span> {{ campaign.goals }}</p>
                    <p><span class="field">Campaign Description:</span> {{ campaign.campaign_description }}</p>
                    <p><span class="field">Start Date:</span> {{ campaign.start_date }}</p>
                    <p><span class="field">End Date:</span> {{ campaign.end_date }}</p>
                    <p><span class="field">Visibility:</span> {{ campaign.visibility }}</p>
                    <p><span class="field">Budget:</span> ₹{{ campaign.budget }}</p>
                </div>

                <!-- Terms and Conditions -->
                <div class="section">
                    <h2>Terms and Conditions</h2>
                    <ul class="terms">
                        <li>The sponsor and influencer agree to adhere to the guidelines provided in this contract.</li>
                        <li>The influencer will represent the campaign professionally and ethically.</li>
                        <li>All produced content will remain the intellectual property of the sponsor unless otherwise specified.</li>
                        <li>Both parties agree to comply with advertising regulations and platform policies.</li>
                        <li>Payment will be made to the influencer as per the milestones established in the campaign.</li>
                        <li>All campaign-related information is confidential and cannot be shared without consent.</li>
                        <li>The sponsor has the right to request content modifications to align with brand standards.</li>
                        <li>Any breach of this contract may result in termination and legal consequences.</li>
                        <li>The influencer must disclose sponsorship in all content in compliance with relevant guidelines.</li>
                        <li>This contract may be modified with the written consent of both parties.</li>
                        <li>Both parties agree that this contract is legally binding and enforceable.</li>
                        <li>Any disputes will be resolved through arbitration or legal channels, if necessary.</li>
                        <li>The influencer agrees not to work with competitor brands during the campaign period.</li>
                        <li>The sponsor will provide the influencer with all necessary assets for the campaign.</li>
                        <li>This agreement follows the policy of OE Analytics and is governed by applicable law.</li>
                    </ul>
                </div>

                <div class="signature">
                    <p>Contract Agreement Signed by both Parties under OEAnalytics Policy</p>
                </div>
            </div>
        </body>
        </html>

    """).render(sponsor=sponsor,campaign=campaign,influencer=influencer)

    # Convert HTML to PDF
    pdf_file_path = f"/tmp/sponser_{id}.pdf"
    HTML(string=html_content).write_pdf(pdf_file_path)

    return pdf_file_path

@shared_task
def daily_reminder(to_list,sub, message):
    for to in to_list:
        send_email(to, sub, message)
    return "OK"

@shared_task
def send_daily_influencer_reminders(email_list):
   
    if email_list:
        # Render an HTML template for the daily reminder message
        subject = "Daily Reminder: Pending Ad Requests"
        message = "<h2>Please check your pending ad requests.</h2>"

        # Send email to each influencer with pending requests
        for email in email_list:
            send_email(email, subject, message)
    
    return "Daily influencer reminders sent."

@shared_task
def send_daily_sponsor_reminders(email_list):
    """
    Daily check for pending campaign approvals or tasks for sponsors and sends reminders.
    """
    
    if email_list:
        # Render an HTML template for the daily reminder message
        subject = "Daily Reminder: Pending Campaign Approvals"
        message = "<h2>Please review your pending campaigns for approval or check active campaigns for updates.</h2>"

        # Send email to each sponsor with pending approvals or tasks
        for email in email_list:
            send_email(email, subject, message)
    
    return "Daily sponsor reminders sent."

@shared_task
def send_monthly_influencer_report(open_campaigns,closed_campaigns,email_list):
    """
    Generates and sends a monthly report to each influencer, including details about campaign status and other metrics.
    """

    # Generate the report content
    subject = "Monthly Campaign Activity Report"
    message = f"""
    <h2>Monthly Campaign Activity Report</h2>
    <p>Dear Influencer,</p>
    <p>Here is the summary of campaign activity for this month:</p>
    <ul>
        <li>Total Open Campaigns: {open_campaigns}</li>
        <li>Total Closed Campaigns: {closed_campaigns}</li>
    </ul>
    <p>Thank you for your ongoing involvement and collaboration.</p>
    """

    # Send the report to each influencer
    for email in email_list:
        send_email(email, subject, message)
    
    return "Monthly influencer reports sent."
