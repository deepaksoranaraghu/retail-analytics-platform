import os
import pandas as pd
from sqlalchemy import create_engine
from dagster import job, op
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

if DB_HOST == "/tmp":
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}@/{DB_NAME}?host=/tmp"
else:
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

@op
def extract_data():
    df = pd.read_csv("../data/sales.csv")
    return df

@op
def transform_data(df: pd.DataFrame):
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["quantity"] = df["quantity"].astype(int)
    df["price"] = df["price"].astype(float)
    return df

@op
def load_data(df: pd.DataFrame):
    df.to_sql("sales", engine, if_exists="append", index=False)
    return "Data loaded successfully"

@job
def etl_job():
    load_data(transform_data(extract_data()))
