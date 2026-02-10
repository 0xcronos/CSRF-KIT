import http.server
import socketserver
import base64
from urllib.parse import urlparse, parse_qs

PORT = 80

class MyRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        data_params = query_params.get('data')
        if data_params:
            try:
                data_value = data_params[0].replace(" ", "+")
                decoded_value = base64.b64decode(data_value).decode('utf-8')
                print(decoded_value)
            except Exception as e:
                print(e)
                print("DEBUG ONLY: " + data_params[0])

        # prepare response
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', 'http://bookworm.htb')
        self.end_headers()

        # sending empty response because YOLO MADAFUCKAAA
        self.wfile.write(b'')

    def log_message(self, format, *args):
        pass

def run_server():
    server_address = ('', PORT)

    socketserver.TCPServer.allow_reuse_address = True

    with socketserver.TCPServer(server_address, MyRequestHandler) as httpd:
        print(f"Starting custom HTTP server on port {PORT}")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        
        httpd.server_close()
        print("Server stopped.")

if __name__ == "__main__":
    run_server()
