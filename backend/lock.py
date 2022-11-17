from contextlib import contextmanager
import os

from aioredlock import Aioredlock, LockError, Sentinel

if os.getenv("DEV"):
    redis_conf = [
        {"host": "localhost", "port": 6379, "db": 0},
    ]
else:
    redis_conf = [
        {
            "host": "redis",
            "port": 6379,
            "db": 0,
            "password": os.getenv("REDIS_PASS"),
        },
    ]

lock_manager = Aioredlock(redis_conf)


@contextmanager
async def redis_lock(name: str, timeout: int = None):
    lock = await lock_manager.lock(name, lock_timeout=timeout)
    print(f"got lock for {name}")
    try:
        yield lock
    finally:
        await lock.release(name)
        print(f"released lock for {name}")
