import json
import redis
from typing import Optional, Any
from app.config import settings

class RedisCache:
    def __init__(self):
        try:
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            # Test connection
            self.redis_client.ping()
            self.is_available = True
        except Exception as e:
            print(f"Redis connection failed: {e}")
            self.redis_client = None
            self.is_available = False
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.is_available:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            print(f"Cache get error: {e}")
        return None
    
    def set(self, key: str, value: Any, expire: int = 300) -> bool:
        """Set value in cache with expiration (default 5 minutes)"""
        if not self.is_available:
            return False
        
        try:
            serialized_value = json.dumps(value, default=str)
            self.redis_client.setex(key, expire, serialized_value)
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.is_available:
            return False
        
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    def clear_pattern(self, pattern: str) -> bool:
        """Clear all keys matching pattern"""
        if not self.is_available:
            return False
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            return True
        except Exception as e:
            print(f"Cache clear pattern error: {e}")
            return False

# Global cache instance
cache = RedisCache()