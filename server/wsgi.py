from app import create_app
from os import environ

app = create_app()

if __name__ == "__main__":
    if environ.get("FLASK_ENV") == "development":
        app.run(debug=True, host="0.0.0.0", port=8000)
    else:
        app.run(debug=False, port=8000, host="127.0.0.1")