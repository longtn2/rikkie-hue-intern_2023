from flask import Blueprint, request
from flask_jwt_extended import JWTManager, jwt_required
from project.api.v1.has_permission import has_permission
from werkzeug.exceptions import BadRequest, NotFound, Conflict, InternalServerError
from project.api.common.base_response import BaseResponse
from project.services.room_service import RoomService
from typing import Optional

room_blueprint = Blueprint('room_controller', __name__)


@room_blueprint.route("/rooms", methods=["GET"])
@jwt_required()
@has_permission("view")
def get_rooms():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        response_data = RoomService.get_paginated_rooms(page, per_page)

        return BaseResponse.success(response_data)

    except InternalServerError as e:
        return BaseResponse.error(e)


@room_blueprint.route("/rooms/<int:room_id>", methods=["GET"])
@jwt_required()
@has_permission("view")
def get_room_detail(room_id: int) -> BaseResponse:
    try:
        room_detail: Optional[dict] = RoomService.get_room_detail(room_id)
        if room_detail:
            return BaseResponse.success(room_detail)
        return BaseResponse.error(InternalServerError("Room not found"))

    except InternalServerError as e:
        return BaseResponse.error(e)
