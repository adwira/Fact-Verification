import contextvars
from queue import Queue

# Contextual queue for agent events to stream to frontend
agent_event_queue = contextvars.ContextVar('agent_event_queue', default=None)
