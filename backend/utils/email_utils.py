import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

BREVO_SMTP_LOGIN    = os.getenv("BREVO_SMTP_LOGIN", "")
BREVO_SMTP_PASSWORD = os.getenv("BREVO_SMTP_PASSWORD", "")
EMAIL_FROM          = os.getenv("EMAIL_USER", "noreply@servesync.app")


def send_order_receipt_email(to_email: str, name: str, order_id: str, items: list, total: float, payment_method: str):
    if not BREVO_SMTP_LOGIN or not BREVO_SMTP_PASSWORD:
        print(f"[EMAIL SKIPPED] Order receipt for {to_email}")
        return

    items_html = "".join([
        f"<tr><td style='padding:8px 0;color:#374151;'>{i['name']} x{i['quantity']}</td>"
        f"<td style='padding:8px 0;color:#374151;text-align:right;font-weight:600;'>₹{i['subtotal']}</td></tr>"
        for i in items
    ])

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"ServeSync — Order Confirmed #{order_id[-6:].upper()}"
    msg["From"]    = f"ServeSync <{EMAIL_FROM}>"
    msg["To"]      = to_email

    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #e5e7eb;">
      <div style="margin-bottom:20px;">
        <span style="font-weight:800;font-size:20px;color:#f97316;">🍽️ ServeSync</span>
      </div>
      <h2 style="color:#111827;margin:0 0 4px;">Order Confirmed! 🎉</h2>
      <p style="color:#6b7280;margin:0 0 24px;">Hi {name}, your order has been placed successfully.</p>

      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;color:#9a3412;font-weight:600;">Order ID: #{order_id[-6:].upper()}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#9a3412;">Payment: {payment_method}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="border-bottom:1px solid #f3f4f6;">
            <th style="text-align:left;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:600;">ITEM</th>
            <th style="text-align:right;padding:8px 0;font-size:12px;color:#9ca3af;font-weight:600;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>{items_html}</tbody>
        <tfoot>
          <tr style="border-top:2px solid #f3f4f6;">
            <td style="padding:12px 0;font-weight:800;color:#111827;">Total</td>
            <td style="padding:12px 0;font-weight:800;color:#f97316;text-align:right;font-size:18px;">₹{total:.0f}</td>
          </tr>
        </tfoot>
      </table>

      <p style="color:#6b7280;font-size:13px;">We'll notify you as your order progresses. Thank you for ordering from ServeSync!</p>
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
      <p style="color:#9ca3af;font-size:12px;">Questions? Visit our Help Center in the app.</p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))
    try:
        with smtplib.SMTP("smtp-relay.brevo.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.login(BREVO_SMTP_LOGIN, BREVO_SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, to_email, msg.as_string())
        print(f"[EMAIL] Order receipt sent to {to_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")


def send_otp_email(to_email: str, otp: str, name: str):
    if not BREVO_SMTP_LOGIN or not BREVO_SMTP_PASSWORD:
        print(f"[EMAIL SKIPPED] OTP for {to_email}: {otp}")
        return

    print(f"[EMAIL] Sending OTP to {to_email}...")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "ServeSync — Your Verification Code"
    msg["From"]    = f"ServeSync <{EMAIL_FROM}>"
    msg["To"]      = to_email

    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #e5e7eb;">
      <div style="margin-bottom:24px;">
        <span style="font-weight:800;font-size:20px;color:#f97316;">🍽️ ServeSync</span>
      </div>
      <h2 style="color:#111827;margin:0 0 8px;">Hi {name}! 👋</h2>
      <p style="color:#6b7280;margin:0 0 24px;">Here is your 6-digit verification code:</p>
      <div style="background:#fff7ed;border:2px solid #fed7aa;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#ea580c;">{otp}</span>
      </div>
      <p style="color:#6b7280;font-size:13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
      <p style="color:#9ca3af;font-size:12px;">If you did not sign up for ServeSync, ignore this email.</p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP("smtp-relay.brevo.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.login(BREVO_SMTP_LOGIN, BREVO_SMTP_PASSWORD)
            server.sendmail(EMAIL_FROM, to_email, msg.as_string())
        print(f"[EMAIL] Sent successfully to {to_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
