#!/usr/bin/env python3
"""
Test script to verify image annotation functionality works
"""
import requests
import base64
import os

def test_annotation():
    # Check if test.jpg exists
    if not os.path.exists('test.jpg'):
        print("❌ test.jpg not found in current directory")
        return
    
    print("🧪 Testing annotation functionality...")
    
    # Test the /test-annotation endpoint
    url = "http://localhost:8000/test-annotation"
    
    try:
        with open('test.jpg', 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            response = requests.post(url, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Test annotation successful!")
            print(f"Status: {data.get('status')}")
            print(f"Message: {data.get('message')}")
            
            # Check if annotated_image is present
            if data.get('annotated_image'):
                print("✅ Annotated image returned!")
                print(f"Image starts with: {data['annotated_image'][:50]}...")
                
                # Save the base64 image for testing
                img_data = data['annotated_image']
                if img_data.startswith('data:image/png;base64,'):
                    base64_data = img_data.split(',')[1]
                    
                    with open('test_annotated_output.png', 'wb') as f:
                        f.write(base64.b64decode(base64_data))
                    print("✅ Annotated image saved as 'test_annotated_output.png'")
                    print("📁 Check the file to see if highlighting is visible")
                else:
                    print("❌ Invalid base64 format")
            else:
                print("❌ No annotated_image in response")
        else:
            print(f"❌ Request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to http://localhost:8000")
        print("Make sure your FastAPI server is running with: python3 main.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_annotation()
