import os
import sys
import importlib.util

_file_dir = os.path.dirname(os.path.abspath(__file__))
_root_dir = os.path.dirname(_file_dir)
_backend_dir = os.path.join(_root_dir, "web", "backend")

if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

_target_file = os.path.join(_backend_dir, "app", "main.py")
_spec = importlib.util.spec_from_file_location("backend_app_main", _target_file)
_mod = importlib.util.module_from_spec(_spec)
sys.modules["backend_app_main"] = _mod
_spec.loader.exec_module(_mod)

app = _mod.app
