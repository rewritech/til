データベースでセレクトクエリを実行するとき、  
日本語の全角・半角やカタカナ・ひらがなと英語の大文字・小文字の区分が必要なばあいがあります。  
そのように区分する基準は照合順位（しょうごうじゅんい）と言います。  

それはデータベースによって違いますが、  
デフォルトはJapanese_CI_ASなので、  
ほとんどは全角で検索しても半角の結果も出ますし、Joinをかけたら要らないデータが多く出ます。  
  
サーバやデータベースの照合順位の属性を変更する方法がありますが、  
そのように変更したら既存のテーブルの照合順位に影響を与えて、  
開発完了しえ使っている機能の不具合が起きる可能性があります。  
  
それで、既存のデータベースにテーブルを追加するばあいは、  
区分の必要なテーブルのカラムにだけ属性を変える方がいいです。  
下記はカラムの照合順位の変更のSQLです。  

```sqlserver
CREATE TABLE dbo.MyTable  
  (PrimaryKey   int PRIMARY KEY,  
   CharCol      varchar(10) COLLATE NOT NULL  
  );  
GO  
ALTER TABLE dbo.MyTable ALTER COLUMN CharCol  
            varchar(10)COLLATE Japanese_CS_AS_KS_WS NOT NULL;  
GO  
```

>参照：https://docs.microsoft.com/ja-jp/sql/relational-databases/collations/set-or-change-the-column-collation?view=sql-server-2016
  
CS：アルファベットの大文字・小文字の区分  
AS：アルファベットの上のアクセントのようなことの区分  
KS：日本語のカタカナ・ひらがなの区分  
WS：日本語の全角・半角の区分  
  
Sはセンシティブ（sensitive）で区分する意味で、  
Iはインセンシティブ（insensitive）で区分しない意味です。  
