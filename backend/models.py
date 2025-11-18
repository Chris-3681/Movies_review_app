from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False, unique=True)

    
    reviews = db.relationship("Review", backref="user", lazy=True, cascade="all, delete-orphan")
    watchlist_items = db.relationship("WatchlistItem", backref="user", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
        }

class Movie(db.Model):
    __tablename__ = "movie"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    release_year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)               
    poster_url = db.Column(db.String(500))          
    trailer_url = db.Column(db.String(500))       

    reviews = db.relationship("Review", backref="movie", lazy=True, cascade="all, delete-orphan")
    watchlist_items = db.relationship("WatchlistItem", backref="movie", lazy=True, cascade="all, delete-orphan")

    def to_dict(self, with_stats: bool = False):
        data = {
            "id": self.id,
            "title": self.title,
            "release_year": self.release_year,
            "description": self.description,
            "poster_url": self.poster_url,
            "trailer_url": self.trailer_url,  
        }
        if with_stats:
            ratings = [r.rating for r in self.reviews]
            data["review_count"] = len(ratings)
            data["avg_rating"] = round(sum(ratings) / len(ratings), 2) if ratings else None
        return data



class Review(db.Model):
    __tablename__ = "review"
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)  
    comment = db.Column(db.Text, nullable=False)     
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey("movie.id"), nullable=False)
# <--
    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "user_id": self.user_id,
            "movie_id": self.movie_id,
        }


class WatchlistItem(db.Model):
    __tablename__ = "watchlist_item"
    id = db.Column(db.Integer, primary_key=True)
    note = db.Column(db.String(200)) 
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey("movie.id"), nullable=False)

    def to_dict(self, with_movie: bool = False):
        data = {
            "id": self.id,
            "note": self.note,
            "user_id": self.user_id,
            "movie_id": self.movie_id,
        }
        if with_movie:
            data["movie"] = self.movie.to_dict(with_stats=True)
        return data
