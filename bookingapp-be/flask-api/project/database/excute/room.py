from project.models import Room, Booking
from math import ceil
from project import db
from datetime import datetime
from itertools import islice
from sqlalchemy import or_
from typing import Optional


class RoomExecutor:
    @staticmethod
    def get_paginated_rooms(page, per_page):
        query = Room.query.paginate(
            page=page, per_page=per_page, error_out=False)
        return query.items, query.total, ceil(query.total / per_page)

    @staticmethod
    def get_room_detail(room_id: int) -> Optional[dict]:
        room = Room.query.get_or_404(room_id)
        if room:
            return room.serialize()
        return None
