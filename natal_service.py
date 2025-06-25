#!/usr/bin/env python3
"""
Natal Chart Generation Service

This service provides an HTTP endpoint to generate natal charts using the natal library.
It accepts birth data via POST request and returns SVG chart data.
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import traceback

# Add natal library to Python path
natal_path = Path(__file__).parent / "natal"
sys.path.insert(0, str(natal_path))

try:
    from natal import Data, Chart, Config, ThemeType
except ImportError as e:
    print(f"Error importing natal library: {e}")
    print("Make sure the natal library is properly installed")
    sys.exit(1)


class NatalChartHandler(BaseHTTPRequestHandler):
    """HTTP request handler for natal chart generation."""
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests to generate natal charts."""
        try:
            # Parse request
            if self.path != '/generate-chart':
                self.send_error(404, "Endpoint not found")
                return
            
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_error(400, "Invalid JSON data")
                return
            
            # Validate required fields
            required_fields = ['name', 'dateOfBirth', 'timeOfBirth', 'coordinates']
            for field in required_fields:
                if field not in data:
                    self.send_error(400, f"Missing required field: {field}")
                    return
            
            # Extract coordinates
            coordinates = data['coordinates']
            if 'lat' not in coordinates or 'lon' not in coordinates:
                self.send_error(400, "Missing latitude or longitude in coordinates")
                return
            
            try:
                lat = float(coordinates['lat'])
                lon = float(coordinates['lon'])
            except (ValueError, TypeError):
                self.send_error(400, "Invalid latitude or longitude values")
                return
            
            # Parse date and time
            try:
                date_str = data['dateOfBirth']  # YYYY-MM-DD
                time_str = data['timeOfBirth']  # HH:MM
                
                # Combine date and time
                datetime_str = f"{date_str} {time_str}"
                utc_dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
                
            except ValueError as e:
                self.send_error(400, f"Invalid date/time format: {e}")
                return
            
            # Generate natal chart
            try:
                # Create chart data
                chart_data = Data(
                    name=data['name'] or 'Natal Chart',
                    lat=lat,
                    lon=lon,
                    utc_dt=utc_dt
                )
                
                # Create chart with default theme
                config = Config()
                config.theme_type = ThemeType.LIGHT
                chart_data.config = config
                
                # Generate SVG chart
                chart = Chart(
                    data1=chart_data,
                    width=600,
                    height=600
                )
                
                svg_content = chart.svg
                
                # Prepare response
                response_data = {
                    'success': True,
                    'svg': svg_content,
                    'metadata': {
                        'name': data['name'],
                        'dateOfBirth': date_str,
                        'timeOfBirth': time_str,
                        'locationOfBirth': data.get('locationOfBirth', ''),
                        'coordinates': {
                            'lat': lat,
                            'lon': lon
                        },
                        'generatedAt': datetime.now().isoformat()
                    }
                }
                
                # Send response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_json = json.dumps(response_data, indent=2)
                self.wfile.write(response_json.encode('utf-8'))
                
            except Exception as e:
                print(f"Error generating chart: {e}")
                traceback.print_exc()
                self.send_error(500, f"Chart generation failed: {str(e)}")
                return
                
        except Exception as e:
            print(f"Unexpected error: {e}")
            traceback.print_exc()
            self.send_error(500, f"Internal server error: {str(e)}")
    
    def log_message(self, format, *args):
        """Custom log message format."""
        print(f"[{self.date_time_string()}] {format % args}")


def main():
    """Start the natal chart service."""
    port = 8001
    server_address = ('localhost', port)
    
    try:
        httpd = HTTPServer(server_address, NatalChartHandler)
        print(f"Natal Chart Service starting on http://localhost:{port}")
        print("Endpoints:")
        print(f"  POST http://localhost:{port}/generate-chart")
        print("\nExample request:")
        print(json.dumps({
            "name": "John Doe",
            "dateOfBirth": "1990-01-15",
            "timeOfBirth": "14:30",
            "locationOfBirth": "New York, NY, USA",
            "coordinates": {
                "lat": "40.7128",
                "lon": "-74.0060"
            }
        }, indent=2))
        print("\nPress Ctrl+C to stop the server")
        
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print("\nShutting down natal chart service...")
        httpd.shutdown()
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()