from project.models import db
from sqlalchemy.orm import validates  
from werkzeug.exceptions import BadRequest

class Room(db.Model):
    """
    Model representing a room in the database.

    Attributes:
        room_id (int): The unique identifier for the room (primary key).
        room_name (str): The name of the room, limited to 50 characters.
        description (str, optional): A description of the room, up to 255 characters.
        deleted_at (datetime, optional): Timestamp indicating when the room was soft-deleted.
        is_blocked (bool): Represents whether the room is currently blocked or not.
        booking (relationship): One-to-many relationship with the 'Booking' model.
                               It provides a back reference named 'room'.
    """
    __tablename__ = "room"
    room_id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    deleted_at = db.Column(db.TIMESTAMP, nullable=True)
    is_blocked = db.Column(db.Boolean, nullable=False)
    booking = db.relationship('Booking', backref='room')

    def serialize(self):
        return {
            'room_id': self.room_id,
            'room_name': self.room_name,
            'description': self.description,
            'is_blocked': self.is_blocked,
            'deleted_at': self.deleted_at
        }
