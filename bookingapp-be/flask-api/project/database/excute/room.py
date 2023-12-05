from project.models import Room, Booking
from math import ceil
from project import db
from datetime import datetime
from itertools import islice
from sqlalchemy import or_
from typing import Optional, Union, List


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

    @staticmethod
    def get_room_by_name(room_name: str) -> Optional[Room]:
        return Room.query.filter_by(room_name=room_name).first()

    @staticmethod
    def add_room(new_room: Union[Room, List[Room]]) -> None:
        if isinstance(new_room, Room):
            db.session.add(new_room)
        elif isinstance(new_room, list):
            db.session.add_all(new_room)
        else:
            raise TypeError("Invalid type for new_room")
    
    @staticmethod
    def commit():
        db.session.commit()