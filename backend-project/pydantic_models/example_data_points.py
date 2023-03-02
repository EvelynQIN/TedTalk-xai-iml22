from __future__ import annotations

from typing import List, TypedDict

from pydantic import BaseModel


# class DataPoint(TypedDict):
#     X1: float
#     X2: float
#     cluster: int


# class ExampleDataResponse(BaseModel):
#     __root__: List[DataPoint]

#     class Config:
#         schema_extra = {
#             "example": [
#                 {"X1": 0.7259144318009806, "X2": 0.6956366918575212, "cluster": 1},
#                 {"X1": 0.06477029320317351, "X2": 0.6431397771638389, "cluster": 0},
#                 {"X1": 0.6616657850166069, "X2": 0.7704235200854092, "cluster": 1},
#                 {"X1": 0.8734582814268944, "X2": 0.45563940738781517, "cluster": 0},
#                 {"X1": 0.5659110175854882, "X2": 0.9090551671240439, "cluster": 1},
#             ]
#         }

# example model of users data

class UserRecord(TypedDict):
    id: str
    favorites: list

class ExampleUserResponse(BaseModel):
    __root__: List[UserRecord]

    class Config:
        schema_extra = {
            "exampleUserData": [
                {"id": "e57cec766488c5a72d02dd6bcdbd1d67201ddc7f", 
                "favorites": ["Adam Ostrow: After your final status update","Richard St. John's 8 secrets of success","Tim Brown urges designers to think big","Arvind Gupta: Turning trash into toys for learning","Graham Hill: Less stuff, more happiness","Steven Johnson: Where good ideas come from","Kevin Slavin: How algorithms shape our world ","Terry Moore: How to tie your shoes"]}
            ]
        }