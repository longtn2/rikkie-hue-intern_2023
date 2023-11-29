from project.models import Room, Booking
from math import ceil
from project import db
from datetime import datetime
from itertools import islice
from sqlalchemy import or_


class RoomExecutor:
    @staticmethod
    def get_paginated_rooms(page, per_page):
        query = Room.query.paginate(
            page=page, per_page=per_page, error_out=False)
        return query.items, query.total, ceil(query.total / per_page)
