from project.database.excute.booking import BookingExecutor
from project.models import Room, Booking, BookingUser, User
from project.api.common.base_response import BaseResponse
from werkzeug.exceptions import BadRequest, InternalServerError, Conflict, NotFound
from flask import request
from datetime import datetime, timedelta
from typing import List
from project.services.booking_service import BookingExecutor
from project.database.excute.room import RoomExecutor
from typing import Union, Dict, Optional, List
from flask_jwt_extended import get_jwt_identity


class BookingService:
    @staticmethod
    def get_bookings_in_date_range_user() -> dict:
        user_id = get_jwt_identity()
        start_date_str = request.args.get('start_date', None)
        end_date_str = request.args.get('end_date', None)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(
                end_date_str, '%Y-%m-%d') + timedelta(days=1)
        else:
            raise BadRequest(
                "Both start_date and end_date are required for date range query.")

        bookings = BookingExecutor.get_bookings_in_date_range_user(
            start_date, end_date, user_id)
        list_bookings = []
        for booking in bookings:
            user_ids = [
                booking_user.user_id for booking_user in booking.booking_user]
            if user_id in user_ids:
                user_names = [
                    booking_user.user.user_name for booking_user in booking.booking_user]
                user_ids = [
                    booking_user.user_id for booking_user in booking.booking_user]
                room = Room.query.filter_by(room_id=booking.room_id).first()
                room_name = room.room_name if room else None
                booking_info = {
                    "booking_id": booking.booking_id,
                    "title": booking.title,
                    "time_start": booking.time_start.strftime('%Y-%m-%d %H:%M:%S'),
                    "time_end": booking.time_end.strftime('%Y-%m-%d %H:%M:%S'),
                    "room_name": room_name,
                    "user_name": user_names,
                    "room_id": booking.room_id,
                    "user_id": user_ids,
                    "is_accepted": booking.is_accepted
                }
                list_bookings.append(booking_info)

        return list_bookings
