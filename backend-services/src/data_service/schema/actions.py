from pydantic import BaseModel, Field

from common.types import WalletAddress
from data_service.schema.entities import Bookmark, BookmarkList


class CreateBookmark(BaseModel):
    """
    Bookmark creation parameters.
    """

    wallet_id: WalletAddress
    bookmark: Bookmark


class CreateBookmarkResult(BaseModel):
    """
    Bookmark creation outcome.
    """

    success: bool


class DeleteBookmark(BaseModel):
    """
    Bookmark deletion parameters.
    """

    wallet_id: WalletAddress
    bookmark: Bookmark


class DeleteBookmarkResult(BaseModel):
    """
    Bookmark deletion result.
    """

    success: bool


class GetBookmarksResult(BaseModel):
    """
    Contains a list of bookmarks when successful or `None` otherwise.
    """

    bookmarks: BookmarkList | None = Field(...)
