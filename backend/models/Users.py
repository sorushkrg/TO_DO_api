from datetime import datetime
from ..models import BigInteger, DateTime, PrimaryKeyConstraint, SmallInteger, String, UniqueConstraint, text, Optional, \
    Mapped, mapped_column, relationship, Base
from ..models import Tasks


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('email', name='users_email_key')
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_admin: Mapped[Optional[int]] = mapped_column(SmallInteger, server_default=text('0'))

    tasks: Mapped[list['Tasks']] = relationship('Tasks', back_populates='user')

