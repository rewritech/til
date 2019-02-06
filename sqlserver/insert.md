## insert option

* インサートの時、可変長さの文字例でもエラーが出ます。  
そのばあい、ANSI WARNINGSをオフしたら、データ格納ができます。
```SQL
SET ANSI WARNINGS OFF

INSERT INTO ([Address]) VALUES ('longer than length of varchar(10)')
```
