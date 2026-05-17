# app.py

from flask import Flask, render_template, jsonify
import requests
import json

app = Flask(__name__)

NEWS_API_KEY = "YOUR_API_KEY"

# Load alliance data
with open("data/alliances.json", "r") as f:
    alliances = json.load(f)

#Load About_alliance data
with open("data/about_alliances.json", "r") as f:
    alliance_info = json.load(f)


@app.route("/")
def home():
    return render_template("index.html", alliances=alliances)


@app.route("/country/<country>")
def country(country):

    # REST Countries API
    url = f"https://restcountries.com/v3.1/name/{country}"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Country not found"})

    data = response.json()[0]

    country_data = {
        "name": data.get("name", {}).get("common", ""),
        "capital": data.get("capital", ["N/A"])[0],
        "population": data.get("population", 0),
        "region": data.get("region", ""),
        "flag": data.get("flags", {}).get("png", ""),
        "maps": data.get("maps", {}).get("googleMaps", ""),
    }

    # Alliance lookup
    memberships = []

    for bloc, countries in alliances.items():
        if country.strip().lower() in [c.lower() for c in countries]:
            memberships.append(bloc)

    country_data["alliances"] = memberships

    return jsonify(country_data)



@app.route("/alliance/<bloc>")
def alliance(bloc):

    data = alliance_info.get(bloc)

    if not data:
        return jsonify({"error": "Alliance not found"})

    return jsonify(data)

@app.route("/news/<country>")
def news(country):

    url = (
        f"https://newsapi.org/v2/everything?q={country}"
        f"&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    )

    response = requests.get(url)
    data = response.json()

    articles = []

    for article in data.get("articles", [])[:5]:
        articles.append({
            "title": article["title"],
            "url": article["url"]
        })

    return jsonify(articles)


if __name__ == "__main__":
    app.run(debug=True)