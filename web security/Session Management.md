## SessionId(セッションID)
> python3.5、Django 1.11で説明します。

```
　ウェブサーバはユーザぼ認識のために、セッションID（SessionID）を生成して、ユーザのブラウザに保存して置きます。
それで、そのセッションIDの生成や管理のためのセキュリティルールがあります。
```
1. #### セッションIDは推測できないように、疑似乱数乱数で生成します。
    - #### これができない場合は認証のクッキーを発行して管理します。
    ```
    pythonのDjangoの場合は基本的に疑似乱数乱数でセッションIDを発行します。
    ```
1. #### ユーザのログインの時、既存のセッションIDを削除して新しく発行します。
    ```python
    #pythonのDjangoではflsush()でユーザの全セッションの削除ができます。
    def reissue_sessionId(request):
        userId = request.session["userId"]
        request.session.flush()
        request.session["userId"] = userId
    ```
    > ###### 参考：[flush() Django公式サイト](https://docs.djangoproject.com/en/1.11/topics/http/sessions/#django.contrib.sessions.backends.base.SessionBase.flush)
1. #### セッションの時間を短くします。（クッキーかセッションか調査必要）
    1. session.set_expiry(time)
        ```python
        #pythonのDjangoではset_expiry(time)で時間設定できます。
        def set_sessionTime(request):
            time = 3 * 60 * 60  # 時間 * 分 * 秒
            request.session.set_expiry(time)
            session_age = request.session.get_expiry_age()
            print(session_age)
            # > 1800
        ```
    1. settings.pyでSESSION_COOKIE_AGE設定
        ```python
        # 途中に接続しても、削除する。（set_expiryは確認必要）
        SESSION_COOKIE_AGE = 3 * 60 * 60
        ```
