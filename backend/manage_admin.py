"""
JARVIS AI - Admin Account Management CLI
Usage:
    python manage_admin.py list
    python manage_admin.py promote <username_or_email>
    python manage_admin.py set-password <username_or_email> <new_password>
    python manage_admin.py create <username> <email> <password>
"""
import sys
import argparse
from app.database import SessionLocal
from app.models import User
from app.auth.security import hash_password


def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print("\n" + "=" * 80)
        print(f"{'ID':<4} | {'USERNAME':<20} | {'EMAIL':<30} | {'ROLE':<8} | {'STATUS':<15}")
        print("=" * 80)
        for u in users:
            print(f"{u.id:<4} | {u.username:<20} | {u.email:<30} | {u.role:<8} | {u.status:<15}")
        print("=" * 80 + "\n")
    finally:
        db.close()


def promote_user(identifier: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(
            (User.username == identifier) | (User.email == identifier)
        ).first()
        if not user:
            print(f"[ERROR] User '{identifier}' not found.")
            return False
        user.role = "ADMIN"
        user.status = "VERIFIED"
        db.commit()
        print(f"[SUCCESS] User '{user.username}' ({user.email}) is now an ADMIN (Status: VERIFIED).")
        return True
    finally:
        db.close()


def set_password(identifier: str, new_password: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(
            (User.username == identifier) | (User.email == identifier)
        ).first()
        if not user:
            print(f"[ERROR] User '{identifier}' not found.")
            return False
        user.hashed_password = hash_password(new_password)
        db.commit()
        print(f"[SUCCESS] Password for '{user.username}' ({user.email}) successfully updated.")
        return True
    finally:
        db.close()


def create_admin(username: str, email: str, password: str):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing:
            print(f"[WARNING] User with that username or email already exists. Promoting to ADMIN...")
            existing.role = "ADMIN"
            existing.status = "VERIFIED"
            existing.hashed_password = hash_password(password)
            db.commit()
            print(f"[SUCCESS] Updated and promoted existing user '{existing.username}' to ADMIN.")
            return True

        new_user = User(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role="ADMIN",
            status="VERIFIED",
            verification_method="CLI_OVERRIDE"
        )
        db.add(new_user)
        db.commit()
        print(f"[SUCCESS] Admin account '{username}' ({email}) created successfully.")
        return True
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="JARVIS AI Admin Account Management CLI")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # list
    subparsers.add_parser("list", help="List all registered accounts")

    # promote
    p_promote = subparsers.add_parser("promote", help="Promote a user to ADMIN")
    p_promote.add_argument("identifier", help="Username or email of the user")

    # set-password
    p_pwd = subparsers.add_parser("set-password", help="Reset a user's password")
    p_pwd.add_argument("identifier", help="Username or email of the user")
    p_pwd.add_argument("password", help="New password to set")

    # create
    p_create = subparsers.add_parser("create", help="Create a new ADMIN account")
    p_create.add_argument("username", help="Username")
    p_create.add_argument("email", help="Email address")
    p_create.add_argument("password", help="Password")

    args = parser.parse_args()

    if args.command == "list":
        list_users()
    elif args.command == "promote":
        promote_user(args.identifier)
    elif args.command == "set-password":
        set_password(args.identifier, args.password)
    elif args.command == "create":
        create_admin(args.username, args.email, args.password)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
