import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from models import db, User, Movie, Review, WatchlistItem
from flask_migrate import Migrate

# ---- Flask app ----
app = Flask(__name__)
CORS(app)

# ---- Database config ----
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
migrate = Migrate(app, db)


with app.app_context():
    db.create_all()
    if not User.query.first():
        db.session.add(User(username="demo"))
        db.session.commit()

# ---- Helpers ----
def current_user():
    uid = request.headers.get("X-User-Id")
    if uid and uid.isdigit():
        u = User.query.get(int(uid))
        if u:
            return u
    return User.query.first()

def bad(msg, code=400):
    return jsonify({"error": msg}), code

# ---- Health ----
@app.get("/api/health")
def health():
    return {"ok": True}

# ---- Movies ----
@app.get("/api/movies")
def list_movies():
    movies = Movie.query.order_by(Movie.id.desc()).all()
    return jsonify([m.to_dict(with_stats=True) for m in movies])

@app.post("/api/movies")
def add_movie():
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    release_year = data.get("release_year")
    description = (data.get("description") or "").strip() or None
    poster_url = (data.get("poster_url") or "").strip() or None
    trailer_url = (data.get("trailer_url") or "").strip() or None

    if not title:
        return bad("title is required")
    try:
        ry = int(release_year)
    except (TypeError, ValueError):
        return bad("release_year must be a number")

    movie = Movie(
        title=title,
        release_year=ry,
        description=description,
        poster_url=poster_url,
        trailer_url=trailer_url
    )
    db.session.add(movie)
    db.session.commit()
    return movie.to_dict(with_stats=True), 201

@app.get("/api/movies/<int:movie_id>")
def movie_detail(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    data = movie.to_dict(with_stats=True)
    data["reviews"] = [r.to_dict() for r in Review.query.filter_by(movie_id=movie.id).all()]
    return data

@app.patch("/api/movies/<int:movie_id>")
def update_movie(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    data = request.get_json() or {}

    title = data.get("title")
    release_year = data.get("release_year")
    description = data.get("description")
    poster_url = data.get("poster_url")
    trailer_url = data.get("trailer_url")

    if title is not None:
        movie.title = title.strip()
    if release_year is not None:
        try:
            movie.release_year = int(release_year)
        except ValueError:
            return bad("release_year must be a number")
    if description is not None:
        movie.description = description.strip()
    if poster_url is not None:
        movie.poster_url = poster_url.strip()
    if trailer_url is not None:
        movie.trailer_url = trailer_url.strip()

    db.session.commit()
    return movie.to_dict(with_stats=True)

# ---- Reviews ----
@app.post("/api/reviews")
def create_review():
    user = current_user()
    data = request.get_json() or {}
    movie_id = data.get("movie_id")
    rating = data.get("rating")
    comment = (data.get("comment") or "").strip()

    if not isinstance(movie_id, int):
        return bad("movie_id (int) required")
    if not Movie.query.get(movie_id):
        return bad("movie not found", 404)

    try:
        rating = int(rating)
    except (TypeError, ValueError):
        return bad("rating must be number")
    if rating < 1 or rating > 5:
        return bad("rating 1–5 only")
    if len(comment) < 10:
        return bad("comment at least 10 chars")

    review = Review(user_id=user.id, movie_id=movie_id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()
    return review.to_dict(), 201

@app.get("/api/reviews")
def list_reviews():
    reviews = Review.query.order_by(Review.id.desc()).all()
    return jsonify([r.to_dict() for r in reviews])

@app.get("/api/movies/<int:movie_id>/reviews")
def movie_reviews(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    reviews = Review.query.filter_by(movie_id=movie.id).all()
    return jsonify([r.to_dict() for r in reviews])

# ---- Watchlist ----
@app.get("/api/watchlist")
def get_watchlist():
    user = current_user()
    items = WatchlistItem.query.filter_by(user_id=user.id).all()
    return jsonify([w.to_dict(with_movie=True) for w in items])

@app.post("/api/watchlist")
def add_watchlist_item():
    user = current_user()
    data = request.get_json() or {}
    movie_id = data.get("movie_id")
    note = (data.get("note") or "").strip() or None

    if not isinstance(movie_id, int):
        return bad("movie_id required")
    if not Movie.query.get(movie_id):
        return bad("movie not found", 404)

    item = WatchlistItem(user_id=user.id, movie_id=movie_id, note=note)
    db.session.add(item)
    db.session.commit()
    return item.to_dict(with_movie=True), 201

@app.delete("/api/watchlist/<int:item_id>")
@cross_origin()
def delete_watchlist_item(item_id):
    user = current_user()
    item = WatchlistItem.query.filter_by(id=item_id, user_id=user.id).first()
    if not item:
        return bad("Watchlist item not found", 404)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed successfully"})

# ---- Run ----
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)