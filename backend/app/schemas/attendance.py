from pydantic import BaseModel
from datetime import datetime

class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    timestamp: datetime
    status: str
    
    # We will include the user name for display
    user_name: str

    class Config:
        orm_mode = True
