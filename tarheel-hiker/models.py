from sqlalchemy import Column, Float, ForeignKey, Integer, String, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# monkey patch JSONEncoder
from json import dumps, JSONEncoder

def default_patch(enc, inst):
    """
    Convert SQLAlchemy result to dict
    """
    
    if hasattr(inst, "to_json"):
        return inst.to_json()
    
    elif isinstance(inst, Base):
        d = {}
        for k in inst.__table__.columns:
            try:
                d[k.name] = getattr(inst, k.name)
            except:
                pass
        return d
    
    return enc._default(inst)


JSONEncoder._default = JSONEncoder.default
JSONEncoder.default = default_patch


class Location(Base):
    
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

    
class Media(Base):
    
    __tablename__ = "media"
    
    id = Column(Integer, primary_key=True)
    filename = Column(String)
    type = Column(String)
    
    def to_json(self):
        return dict(filename=self.filename, type=self.type)
    
    
class CollectionItem(Base):
    
    __tablename__ = "collectionItems"
    
    id = Column(Integer, primary_key=True)
    media_id = Column("media", Integer, ForeignKey('media.id'))
    collection = Column(Integer, ForeignKey('collections.id'))
    step = Column(Integer)
    
    media = relationship("Media")
    
    def to_json(self):
        return default_patch(None, self.media)
    
    
class Collection(Base):
    
    __tablename__ = "collections"
    
    id = Column(Integer, primary_key=True)
    hike_slug = Column("hike", String, ForeignKey('hikes.slug'))
    type = Column("type", String, ForeignKey('collectionTypes.type'))
    
    collection_type = relationship("CollectionType")
    items = relationship("CollectionItem", primaryjoin="Collection.id == CollectionItem.collection")
    
    def to_json(self):
        return dict(
            type=self.collection_type,
            items=sorted(self.items, key=lambda i: i.step)
        )
    

class CollectionType(Base):
    
    __tablename__ = "collectionTypes"
    
    type = Column(String, primary_key=True)
    title = Column(String)
    about = Column(String)


class Hike(Base):
    
    __tablename__ = "hikes"
    
    slug = Column(String, primary_key=True)
    about = Column(String)
    location_id = Column(Integer, ForeignKey('locations.id'))
    title = Column(String)
    
    location = relationship("Location")
    collections = relationship("Collection", backref="hike")
    
    def to_json(self):
        return dict(
            slug=self.slug,
            about=self.about,
            title=self.title,
            location=self.location,
            collections=self.collections
        )

