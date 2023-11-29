from project.database.excute.room import RoomExecutor
from math import ceil
from project.models import Room
from werkzeug.exceptions import Conflict, BadRequest, NotFound


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
