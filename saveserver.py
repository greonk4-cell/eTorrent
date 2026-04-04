from flask import Flask, render_template_string, request, jsonify
import json
import os

app = Flask(__name__)
DATA_FILE = 'games.json'

# Инициализация файла базы данных
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@app.route('/')
def index():
    return render_template_string(HTML_CODE)

@app.route('/get_games')
def get_games():
    with open(DATA_FILE, 'r') as f:
        return jsonify(json.load(f))

@app.route('/upload', methods=['POST'])
def upload():
    new_game = request.json
    with open(DATA_FILE, 'r+') as f:
        data = json.load(f)
        data.insert(0, new_game)
        f.seek(0)
        json.dump(data, f)
    return jsonify({"status": "success"})

# Сюда вставь весь свой HTML код (я подготовлю его ниже)
HTML_CODE = """
"""

if __name__ == '__main__':
    # Запуск сервера на порту 8080, доступном для всех в сети
    app.run(host='0.0.0.0', port=8080)
