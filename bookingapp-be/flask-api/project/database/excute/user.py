from project.models.user import User
from project.models.user_has_role import UserHasRole
from project.models.role import Role
from project.models.role_has_permission import RoleHasPermission
from project.models.permission import Permission
from typing import Optional, Union, List
from project import db


class UserExecutor:

    @staticmethod
    def get_user_by_email(email: str):
        user = User.query.filter_by(email=email, is_deleted=0).first()
        return user

    @staticmethod
    def get_user(user_id: int):
        user = User.query.filter_by(user_id=user_id, is_deleted=0).first()
        return user

    @staticmethod
    def get_role_names(user_id: int):
        user = User.query.filter_by(user_id=user_id, is_deleted=0).first()
        role_names = [
            user_role.role.role_name for user_role in user.user_has_role]
        return role_names

    

