"""
Test email sending directly.
Usage: python test_email.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

print("RESEND_API_KEY:", os.getenv("RESEND_API_KEY", "NOT SET"))
print("EMAIL_USER:", os.getenv("EMAIL_USER", "NOT SET"))
print("EMAIL_VERIFICATION:", os.getenv("EMAIL_VERIFICATION", "NOT SET"))

from utils.email_utils import send_otp_email

print("\nSending test OTP...")
send_otp_email(os.getenv("EMAIL_USER"), "123456", "Test User")
print("Done.")
