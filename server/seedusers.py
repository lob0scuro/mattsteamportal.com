import json
from app.models import User
from app.extensions import db
from app.models import RoleEnum, DepartmentEnum

JSON_PATH = "../user_load.json"
departments = ["cleaner", "office", "sales", "service", "driver", "technician"]
role = "employee"

def split_name(full_name: str):
    parts = full_name.strip().split(" ", 1)
    first = parts[0]
    last = parts[1] if len(parts) > 1 else ""
    return first, last

def user_exists(email: str, username: str) -> bool:
    return (
        db.session.query(User.id)
        .filter((User.email == email) | (User.username == username))
        .first()
        is not None
    )    


def create_user(data: dict, department: DepartmentEnum):
    if user_exists(data["email"], data["username"]):
        print(f'Skipping existing user: {data["email"]}')
        return
    
    first_name, last_name = split_name(data["name"])
    
    user = User(
        first_name=first_name,
        last_name=last_name,
        email=data["email"],
        phone_number=data["phone_number"],
        username=data["username"],
        role=RoleEnum.EMPLOYEE,
        department=department,
    )
    user.set_password(data["password"])
    
    db.session.add(user)
    print(f"Added user: {user.full_name} ({department.name})")
    

def seed_user():
    with open(JSON_PATH, "r") as f:
        payload = json.load(f)
        
    for department_key, users in payload.items():
        
        if department_key == "owner":
            continue
        
        if department_key == "technician":
            for _, tech_group in users.items():
                for user_data in tech_group:
                    create_user(
                        user_data,
                        DepartmentEnum.TECHNICIAN
                    )
            continue
        
        department_enum = DepartmentEnum[department_key.upper()]
        
        for user_data in users:
            create_user(user_data, department_enum)
            
    db.session.commit()
    print("User seeding complete!")