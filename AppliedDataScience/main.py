import pandas as pd
from sklearn.datasets import fetch_covtype as ForestCover

#data is gotten from kaggle
df= pd.read_csv("telco_cust_churn.csv")
print(df['Churn'].unique())
df['target'] = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)

print(df.head())
print(df['target'].value_counts())

pd.get_dummies(df)
