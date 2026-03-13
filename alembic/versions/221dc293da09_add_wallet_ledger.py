"""add wallet ledger

Revision ID: 221dc293da09
Revises: f7b2552e6ce4
Create Date: 2026-03-12 16:36:40.086455
"""

from alembic import op
import sqlalchemy as sa

revision = '221dc293da09'
down_revision = 'f7b2552e6ce4'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'wallet_ledger',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer()),
        sa.Column('transaction_type', sa.String()),
        sa.Column('amount', sa.Float()),
        sa.Column('reference', sa.String()),
        sa.Column('balance_after', sa.Float()),
        sa.Column('created_at', sa.DateTime())
    )


def downgrade():
    op.drop_table('wallet_ledger')