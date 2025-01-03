import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_todo(user_name, description):
    """
    API to create a to-do item
    Arguments:
    user_name -- Name of the user
    description -- Description of the task

    Returns:
    response -- The created to-do task or an error message
    """

    try:
        user = frappe.get_doc("User", user_name)
    except frappe.DoesNotExistError:
        return {"status": "error", "message": _("User does not exist")}

    status = "Open"
    
    try:
        todo = frappe.get_doc({
            'doctype': 'ToDo',
            'description': description,
            'status': status, 
            'owner': user.name,  
            'allocated_to': user.name  
            
        })

        todo.insert(ignore_permissions=True)
        frappe.db.commit()  
        

        user_info = {
            "first_name": user.first_name,
            "email": user.email,
            "enabled": user.enabled
        }

        return {
            "status": "success",
            "message": _("To-Do task created successfully"),
            "data": {
                "todo": todo.as_dict(),
                "user_info": user_info
            }
        }
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "To-Do Task Creation Error")
        return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True)
def get_todos(allocated_to):
    """
    API to fetch ToDo items based on the allocated_to field.
    
    Arguments:
    allocated_to -- The user to whom the tasks are allocated.

    """
    try:
        todos = frappe.get_all(
            "ToDo",
            filters={"allocated_to": allocated_to},
            fields=["name", "description", "status", "owner", "allocated_to", "creation"]
        )

        if not todos:
            return {"status": "success", "message": _("No ToDo items found"), "data": []}

        return {
            "status": "success",
            "message": _("ToDo items fetched successfully"),
            "data": todos
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error Fetching ToDo by Allocated To")
        return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def delete_todo(todo_name):
    """
    API to delete a to-do task by its name

    Arguments:
        todo_name -- Name of the to-do task

    Returns:
        response -- Success or error message based on deletion
    """
    try:

        todo = frappe.get_doc("ToDo", todo_name)

        todo.delete(ignore_permissions=True)
        frappe.db.commit()

        return {"status": "success", "message": _("To-Do task deleted successfully")}

    except frappe.DoesNotExistError:
        return {"status": "error", "message": _("To-Do task does not exist")}
    except Exception as e:

        frappe.log_error(frappe.get_traceback(), "To-Do Task Deletion Error")
        return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True)
def update_todo_status(task_name):
    """
    API to update the status of a ToDo task to "Closed"
    """
    try:

        todo = frappe.get_doc("ToDo", task_name)
        
        todo.status = "Closed"
        
        todo.save(ignore_permissions=True)
        frappe.db.commit()
        
        return {
            "status": "success",
            "message": _("To-Do task status updated successfully"),
            "data": todo.as_dict(),
        }
    except frappe.DoesNotExistError:
        return {"status": "error", "message": _("To-Do task does not exist")}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "To-Do Status Update Error")
        return {"status": "error", "message": str(e)}
