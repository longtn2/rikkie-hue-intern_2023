from project.models import Booking, BookingUser, Room
from typing import List, Optional, Union
from project import db


class BookingExecutor:
    @staticmethod
    def get_bookings_in_date_range(start_date, end_date) -> List[Booking]:
        return Booking.query.filter(
            Booking.is_deleted == False,
            Booking.time_end.between(start_date, end_date)
        ).all()