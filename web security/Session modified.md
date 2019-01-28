## session.modified

* セッションに辞書配列を入れる場合、modified = Trueで設定します。
  ```python
  def set_value_in_session_dict(request, key1, key2, value):
      request.session.modifeid = True
      request.session[key1][key2] = value
  ```
> request.session.modifeid = True しなくてバリューをいれたら、エラーが起きます。  
なぜなら、request.session[key1][key2]の時、request.session[key1]はまだ生成しない状態からです。
