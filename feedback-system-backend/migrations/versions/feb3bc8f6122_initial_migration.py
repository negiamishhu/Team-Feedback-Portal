"""Initial migration

Revision ID: feb3bc8f6122
Revises: 
Create Date: 2025-08-03 19:14:45.626096

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'feb3bc8f6122'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create user table
    op.create_table('user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=80), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password_hash', sa.Text(), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('manager_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['manager_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    
    # Create feedback table
    op.create_table('feedback',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('manager_id', sa.Integer(), nullable=False),
        sa.Column('employee_id', sa.Integer(), nullable=False),
        sa.Column('strengths', sa.Text(), nullable=False),
        sa.Column('areas_to_improve', sa.Text(), nullable=False),
        sa.Column('sentiment', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('acknowledged', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['manager_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create feedback_request table
    op.create_table('feedback_request',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('employee_id', sa.Integer(), nullable=False),
        sa.Column('manager_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['manager_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('feedback_request')
    op.drop_table('feedback')
    op.drop_table('user')
