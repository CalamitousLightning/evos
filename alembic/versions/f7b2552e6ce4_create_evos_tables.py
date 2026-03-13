"""create evos tables"""

from alembic import op
import sqlalchemy as sa

revision = "f7b2552e6ce4"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String()),
        sa.Column("full_name", sa.String()),
        sa.Column("phone", sa.String()),
        sa.Column("password_hash", sa.String()),
        sa.Column("role", sa.String()),
        sa.Column("status", sa.String()),
        sa.Column("invited_by", sa.String()),
    )

    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("agent_id", sa.Integer()),
        sa.Column("customer_phone", sa.String()),
        sa.Column("network", sa.String()),
        sa.Column("bundle", sa.String()),
        sa.Column("amount", sa.Float()),
        sa.Column("status", sa.String()),
        sa.Column("created_at", sa.DateTime()),
    )

    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("transaction_reference", sa.String()),
        sa.Column("agent_id", sa.Integer()),
        sa.Column("customer_phone", sa.String()),
        sa.Column("network", sa.String()),
        sa.Column("data_plan", sa.String()),
        sa.Column("status", sa.String()),
        sa.Column("amount", sa.Float()),
        sa.Column("created_at", sa.DateTime()),
    )

    op.create_table(
        "wallets",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer()),
        sa.Column("balance", sa.Float()),
        sa.Column("total_commission", sa.Float()),
    )

    op.create_table(
        "withdrawals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer()),
        sa.Column("amount", sa.Float()),
        sa.Column("status", sa.String()),
    )


def downgrade():
    op.drop_table("withdrawals")
    op.drop_table("wallets")
    op.drop_table("transactions")
    op.drop_table("orders")
    op.drop_table("users")