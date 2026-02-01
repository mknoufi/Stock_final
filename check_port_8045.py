import socket

port = 8045
try:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("0.0.0.0", port))
        print(f"Port {port} is available")
except Exception as e:
    print(f"Port {port} is busy: {e}")
