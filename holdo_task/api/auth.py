import frappe
from frappe.utils.password import update_password
from frappe.model.naming import make_autoname

@frappe.whitelist(allow_guest=True)
def register(username, password):
    """
    Registers a new user with the given username (email) and password.
    """
    if frappe.db.exists("User", username):
        return {"status": "error", "message": "User already exists"}
    try:

        user = frappe.get_doc({
            "doctype": "User",
            "email": username,
            "enabled": 1,
            "first_name": username.split('@')[0],
            "send_welcome_email": 0,

        })
        user.insert(ignore_permissions=True) 

        update_password(user.name, password)

        return {
            "status": "success",
            "message": "User created successfully",
            "email": user.name 
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "User Registration Error")
        return {"status": "error", "message": str(e)}
