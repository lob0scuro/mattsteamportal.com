from enum import Enum

#-------------------------
#   SCHEDULER ENUMS
#-------------------------
class DepartmentEnum(Enum):
    SALES = "sales"
    SERVICE = "service"
    CLEANER = "cleaner"
    TECHNICIAN = "technician"
    OFFICE = "office"
    
    def __str__(self):
        return self.value
    
class TimeOffStatusEnum(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    
    def __str__(self):
        return self.value
    
class LocationEnum(Enum):
    LAKE_CHARLES = "lake_charles"
    JENNINGS = "jennings"
    LAFAYETTE = "lafayette"
    
    def __str__(self):
        return self.value
    
class RoleEnum(Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"
    
    def __str__(self):
        return self.value
    
    
#-------------------------
#   PORTAL ENUMS
#-------------------------
class PostCategoryEnum(Enum):
    GENERAL = "general"
    UPDATE = "update"
    ALERT = "alert"
    TRAINING = "training"
    MOTIVATIONAL = "motivational"
    
    def __str__(self):
        return self.value
    
class PostVisibilityEnum(Enum):
    PUBLIC = "public" #all employees
    PRIVATE = "private" # managers + admins
    
    def __str__(self):
        return self.value
    
    
    