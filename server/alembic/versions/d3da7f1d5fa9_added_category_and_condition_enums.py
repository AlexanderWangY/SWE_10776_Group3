"""added category and condition enums

Revision ID: d3da7f1d5fa9
Revises: 00095ee96aa1
Create Date: 2025-11-13 18:00:04.225196

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# the below line was added by copilot to help debug the database migration
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'd3da7f1d5fa9'
down_revision: Union[str, Sequence[str], None] = '00095ee96aa1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # these revisions were added by copilot to help debug the database migration
    bind = op.get_bind()
    # Create enum types first (Autogenerate did not emit CREATE TYPE for add_column)
    listing_category_enum = postgresql.ENUM(
        'electronics',
        'school supplies',
        'furniture',
        'appliances',
        'clothing',
        'textbooks',
        'miscellaneous',
        name='listingcategory'
    )
    listing_condition_enum = postgresql.ENUM(
        'new',
        'like new',
        'very good',
        'good',
        'used',
        name='listingcondition'
    )
    listing_category_enum.create(bind, checkfirst=True)
    listing_condition_enum.create(bind, checkfirst=True)

    op.add_column('listing_table', sa.Column('category', listing_category_enum, nullable=True))
    op.add_column('listing_table', sa.Column('condition', listing_condition_enum, nullable=True))


def downgrade() -> None:
    # these revisions were added by copilot to help debug the database migration
    """Downgrade schema."""
    bind = op.get_bind()
    op.drop_column('listing_table', 'condition')
    op.drop_column('listing_table', 'category')
    # Drop types if no longer used
    for enum_name in ('listingcondition', 'listingcategory'):
        op.execute(sa.text(f'DROP TYPE IF EXISTS {enum_name}'))
