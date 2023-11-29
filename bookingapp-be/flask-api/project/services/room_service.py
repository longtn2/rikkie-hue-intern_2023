from project.database.excute.room import RoomExecutor
from math import ceil
from project.models import Room
from werkzeug.exceptions import Conflict, BadRequest, NotFound
from typing import Optional

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
