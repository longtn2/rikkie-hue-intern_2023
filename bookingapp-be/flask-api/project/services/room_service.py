from project.database.excute.room import RoomExecutor
from math import ceil
from project import db
from werkzeug.exceptions import Conflict, BadRequest, NotFound, InternalServerError
from project.api.common.base_response import BaseResponse
from project.models import Room, Booking
from typing import Optional, List, Dict

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
    
    @staticmethod
    def update_room(room_id: int, data: Dict) -> None:
        room_name = data.get("room_name")

        room_to_update = Room.query.get(room_id)

        if not room_to_update:
            raise NotFound("Room not found")
        
        validate_room_name=Room.validate_room_name(room_name)
        if validate_room_name:
            return BaseResponse.error_validate(validate_room_name)
        
        existing_room = RoomExecutor.get_room_by_name(room_name)
        if existing_room:
            raise BadRequest("Room name already exists")

        room_to_update.room_name = room_name
        db.commit()
        return BaseResponse.success(message="update room successfully!")
    
    @staticmethod
    def delete_room(room_id: int, data: Optional[Dict]) -> Dict:
        try:
            room_to_delete: Room = RoomExecutor.get_room_by_id(room_id)

            if not room_to_delete:
                raise NotFound("Room not found")

            if room_to_delete.is_blocked:
                raise BadRequest("Cannot block locked rooms")

            description: Optional[str] = data.get("description") if data else None

            bookings_to_delete: List[Booking] = RoomExecutor.get_bookings_by_room_id(room_id)

            RoomExecutor.soft_delete_room_and_bookings(room_to_delete, bookings_to_delete, description)

            return {"message": "Room and associated bookings blocked successfully"}

        except Exception as e:
            raise InternalServerError(e)
