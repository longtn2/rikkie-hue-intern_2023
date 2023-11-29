from flask import Blueprint, request
from flask_jwt_extended import JWTManager, jwt_required
from project.api.v1.has_permission import has_permission
from werkzeug.exceptions import BadRequest, NotFound, Conflict, InternalServerError
from project.api.common.base_response import BaseResponse
from project.services.room_service import RoomService
from typing import Optional, Dict

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
    

@room_blueprint.route("/rooms", methods=["POST"])
@jwt_required()
@has_permission("create")
def create_room() -> BaseResponse:
    try:
        data: Dict = request.get_json()
        response_data = RoomService.create_room(data)
        return BaseResponse.success(response_data)

    except BadRequest as e:
        return BaseResponse.error(e)

@room_blueprint.route("/rooms/<int:room_id>", methods=["PUT"])
@jwt_required()
@has_permission("update")
def update_room(room_id: int):
    try:
        data: Dict = request.get_json()
        response_data = RoomService.update_room(room_id, data)
        return BaseResponse.success(response_data)

    except NotFound as e:
        return BaseResponse.error(e)
