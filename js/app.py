from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_FILE = "js/database.db"

# ---- Função para executar comandos no SQLite ----
def execute_sql(query, params=()):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
    finally:
        conn.close()

# ---- Criar tabela (se não existir) ----
execute_sql("""
CREATE TABLE IF NOT EXISTS acessos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT,
    referrer TEXT,
    user_agent TEXT,
    timestamp TEXT
)
""")

# ---- Rota de registro ----
@app.route("/log", methods=["POST"])
def log():
    data = request.json or {}
    page = data.get("page", "")
    referrer = data.get("referrer", "")
    user_agent = data.get("userAgent", "")

    execute_sql("""
        INSERT INTO acessos (page, referrer, user_agent, timestamp)
        VALUES (?, ?, ?, ?)
    """, (
        page,
        referrer,
        user_agent,
        datetime.utcnow().isoformat()
    ))

    print(f"✅ Acesso registrado: page='{page}', referrer='{referrer}', user_agent='{user_agent}'")
    return jsonify({"status": "logged"}), 200

# ---- Rota para listar (teste local) ----
@app.route("/listar", methods=["GET"])
def listar():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM acessos")
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
