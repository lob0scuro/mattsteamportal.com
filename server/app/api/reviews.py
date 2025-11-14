from flask import Blueprint, request, jsonify, current_app
from flask_mailman import EmailMessage
from app.extensions import  db
from app.models import User, Reviews

reviews_bp = Blueprint("reviews", __name__)

@reviews_bp.route("/send_review", methods=["POST"])
def send_review():
    data = request.get_json()
    name = data.get("name", "").strip().title()
    email = data.get("email", "").strip()
    appliance = data.get("appliance", "").strip()
    sales_associate = data.get("sales_associate", "").strip()
    review = data.get("review", "").strip()
    
    new_review = Reviews(
        name=name,
        email=email,
        appliance=appliance,
        sales_associate=sales_associate,
        review=review
    )
        
    try:
        db.session.add(new_review)
        db.session.commit()
        body = f"""
        A new review has been submitted for Matt's Appliances via the online review form.
        
        [SENDER]
        {name}
        
        [APPLIANCE CONSIDERED]
        {appliance}
        
        [SALES ASSOCIATE]
        {sales_associate}
        
        [EMAIL]
        {email}
        
        [REVIEW]
        {review}
        """
        msg = EmailMessage(
            subject=f"New review from {name}",
            body=body,
            to=["cameron@mattsappliancesla.net"]
        )
        msg.send()
        current_app.logger.info(f"A review has been submitted by {name}!")
        return jsonify(success=True, message="Your review has been submitted! Thank You."), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[REVIEW SUBMISSION ERROR]: {e}")
        return jsonify(success=False, message="There was an error when submitting review, please try again in a little bit."), 500
    
    

@reviews_bp.route("/get_reviews", methods=["GET"])
def get_reviews():
    reviews = Reviews.query.all()
    return jsonify(success=True, reviews=[r.serialize() for r in reviews]), 200

@reviews_bp.route("/get_review/<int:id>", methods=["GET"])
def get_review(id):
    review = Reviews.query.get(id)
    if not review:
        return jsonify(success=False, message="Review not found"), 400
    return jsonify(success=True, review=review.serialize()), 200