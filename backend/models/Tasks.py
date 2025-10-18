
from ..models import BigInteger, DateTime, ForeignKeyConstraint, PrimaryKeyConstraint, SmallInteger, String, Text,  text, Optional , datetime , Mapped, mapped_column, relationship , Base

from ..models.Users import Users

from ..models.Files import Files

from datetime import datetime

class Tasks(Base):
    __tablename__ = 'tasks'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='fk_tasks_user'),
        PrimaryKeyConstraint('id', name='tasks_pkey')
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status: Mapped[Optional[int]] = mapped_column(SmallInteger, server_default=text('0'))
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime , nullable=True)

    user: Mapped['Users'] = relationship('Users', back_populates='tasks')
    files: Mapped[list['Files']] = relationship('Files', back_populates='task')


