import logging
from flask_mail import Mail, Message

logger = logging.getLogger(__name__)

mail = Mail()

def send_welcome_email(email, name):
    """
    Sends a welcome email to newly registered users.
    """
    try:
        msg = Message('Welcome to UrbanEye',
                      recipients=[email])
        msg.body = f"Hello {name},\n\nWelcome to UrbanEye! We are excited to have you on board. Please explore our features to report and track civic issues.\n\nBest regards,\nUrbanEye Team"
        mail.send(msg)
        logger.info(f"Welcome email sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email to {email}: {str(e)}")
        return False
