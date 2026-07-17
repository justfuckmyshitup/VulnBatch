from __future__ import annotations

import argparse
import getpass
import sys
from typing import cast

from sqlalchemy import select

from vulnbatch.core.security import (
    hash_password,
    normalize_username,
    validate_password,
    validate_username,
)
from vulnbatch.db.models import Role, User
from vulnbatch.db.session import SessionLocal


def _password_from_args(args: argparse.Namespace) -> str:
    if args.password:
        return cast(str, args.password)
    first = getpass.getpass("Password: ")
    second = getpass.getpass("Confirm password: ")
    if first != second:
        raise ValueError("Passwords do not match.")
    return first


def create_user(args: argparse.Namespace) -> int:
    username = normalize_username(args.username)
    if not validate_username(username):
        print("Invalid username.", file=sys.stderr)
        return 2
    password = _password_from_args(args)
    validation = validate_password(password, username)
    if not validation.valid:
        print(" ".join(validation.errors), file=sys.stderr)
        return 2
    with SessionLocal.begin() as db:
        existing = db.scalar(select(User).where(User.username == username))
        if existing is not None:
            print("User already exists.", file=sys.stderr)
            return 2
        role_name = cast(str, args.role)
        role = db.scalar(select(Role).where(Role.name == role_name))
        if role is None:
            description = (
                "Full administrative access"
                if role_name == "administrator"
                else "Read-only inventory and report access"
            )
            role = Role(name=role_name, description=description)
            db.add(role)
            db.flush()
        db.add(
            User(
                username=username,
                display_name=args.display_name,
                password_hash=hash_password(password),
                role_id=role.id,
            )
        )
    print(f"User {username} created with role {role_name}.")
    return 0


def reset_admin_password(args: argparse.Namespace) -> int:
    username = normalize_username(args.username)
    password = _password_from_args(args)
    validation = validate_password(password, username)
    if not validation.valid:
        print(" ".join(validation.errors), file=sys.stderr)
        return 2
    with SessionLocal.begin() as db:
        user = db.scalar(select(User).where(User.username == username))
        if user is None or user.role.name != "administrator":
            print("Administrator not found.", file=sys.stderr)
            return 2
        user.password_hash = hash_password(password)
    print(f"Password reset for {username}.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="vulnbatch")
    subparsers = parser.add_subparsers(dest="command", required=True)

    create = subparsers.add_parser("create-user")
    create.add_argument("--username", required=True)
    create.add_argument("--display-name", required=True)
    create.add_argument("--password")
    create.add_argument(
        "--role",
        choices=("administrator", "read_only"),
        default="read_only",
    )
    create.set_defaults(func=create_user)

    create_admin = subparsers.add_parser("create-admin")
    create_admin.add_argument("--username", required=True)
    create_admin.add_argument("--display-name", required=True)
    create_admin.add_argument("--password")
    create_admin.set_defaults(func=create_user, role="administrator")

    reset = subparsers.add_parser("reset-admin-password")
    reset.add_argument("--username", required=True)
    reset.add_argument("--password")
    reset.set_defaults(func=reset_admin_password)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    try:
        raise SystemExit(args.func(args))
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(2) from exc
