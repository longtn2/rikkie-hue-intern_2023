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
    def get_role_names(user_id: int) -> List[str]:
        user = User.query.filter_by(user_id=user_id, is_deleted=0).first()
        role_names = []
        if  user and user.user_has_role:
            role_names = [
                user_role.role.role_name for user_role in user.user_has_role]
        return role_names

    @staticmethod
    def get_permission_names(role_name: str) -> List[str]:
        role = Role.query.filter_by(role_name=role_name).first()
        permission_names=[]
        if role:
            role_permissions = (
                db.session.query(Permission.permission_name)
                .join(RoleHasPermission, Permission.permission_id == RoleHasPermission.permission_id)
                .filter(RoleHasPermission.role_id == role.role_id)
                .all()
            )
            permission_names = [rp[0] for rp in role_permissions]
        return permission_names
