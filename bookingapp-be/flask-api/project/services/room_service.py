from project.database.excute.room import RoomExecutor
from math import ceil
from project import db
from project.models import Room
from werkzeug.exceptions import Conflict, BadRequest, NotFound
from typing import Optional, Dict

class RoomService:
    @staticmethod
    def get_paginated_rooms(page, per_page):
        items, total_items, total_pages = RoomExecutor.get_paginated_rooms(
            page, per_page)

        return {
            "rooms": [item.serialize() for item in items],
            "total_items": total_items,
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages
        }

    @staticmethod
    def get_room_detail(room_id: int) -> Optional[Room]:
        return RoomExecutor.get_room_detail(room_id)

    @staticmethod
    def create_room(data: Dict) -> Dict:
        room_name: str = data.get("room_name")
        is_blocked: Optional[bool] = data.get("is_blocked", False)
        description: Optional[str] = data.get("description")

        existing_room: Optional[Room] = RoomExecutor.get_room_by_name(room_name)
        if existing_room:
            raise Conflict("Room already exists")

        new_room = Room(room_name=room_name, description=description, is_blocked=is_blocked)
        RoomExecutor.add_room(new_room)

        return {"message": "Room created successfully"}
    
    def update_room(room_id: int, data: Dict) -> None:
        room_name = data.get("room_name")

        existing_room = RoomExecutor.get_room_by_name(room_name)
        if existing_room:
            raise BadRequest("Room name already exists")

        room_to_update = Room.query.get(room_id)

        if not room_to_update:
            raise NotFound("Room not found")

        room_to_update.room_name = room_name
        db.commit()

        return {"message": "Room updated successfully"}
