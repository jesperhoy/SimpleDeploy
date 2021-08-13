Option Strict On

Partial Class SimpleDeploy

  Public Class VueApi

    Private Shared Sessions As New Dictionary(Of String, DateTime)

    Public Shared Sub Init()
      JAH.AddRoute("api/login", AddressOf ProcLogin)
      JAH.AddRoute("api/settings", AddressOf ProcSettings)
      JAH.AddRoute("api/acctlist", AddressOf ProcAcctList)
      JAH.AddRoute("api/acct", AddressOf ProcAcct)
      JAH.AddRoute("api/repolist", AddressOf ProcRepoList)
      JAH.AddRoute("api/repo", AddressOf ProcRepo)
      JAH.AddRoute("api/repostate", AddressOf ProcRepoState)
      JAH.AddRoute("api/pw", AddressOf ProcPW)
      JAH.AddRoute("api/logout", AddressOf ProcLogout)
    End Sub

    Private Shared Function GetRequestData(ctx As HttpContext) As String
      Dim strm = New System.IO.StreamReader(ctx.Request.InputStream, System.Text.Encoding.UTF8)
      Return strm.ReadToEnd()
    End Function

    Private Shared Function GetRequestJsonObj(ctx As HttpContext) As JhJson.Object
      Return DirectCast(JhJson.Parse(GetRequestData(ctx)), JhJson.Object)
    End Function

    Private Shared Sub SendError(ctx As HttpContext, errMsg As String)
      ctx.Response.StatusCode = 400
      ctx.Response.ContentType = "text/plain"
      ctx.Response.Write(errMsg)
    End Sub

    Private Shared Function CheckCookie(ctx As HttpContext) As Boolean
      REM purge sessions
      Dim CutOff = DateTime.UtcNow.AddMinutes(-20)
      For Each kv In Sessions.ToArray()
        If kv.Value < CutOff Then Sessions.Remove(kv.Key)
      Next
      Dim c = ctx.Request.Cookies("api-session")
      If c IsNot Nothing AndAlso Sessions.ContainsKey(c.Value) Then
        Sessions(c.Value) = DateTime.UtcNow
        Return True
      End If
      ctx.Response.StatusCode = 401
      ctx.Response.ContentType = "application/json"
      ctx.Response.Write(If(AppCfg.AdminPwHash.Length > 0, "1", "0"))
      Return False
    End Function


    Private Shared Sub ProcLogin(ctx As HttpContext)
      If ctx.Request.HttpMethod <> "POST" Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      Dim pw = GetRequestData(ctx)
      If SimpleDeploy.HashAdminPW(pw.Trim()) <> SimpleDeploy.AppCfg.AdminPwHash Then SendError(ctx, "Incorrect password") : Exit Sub
      MakeAndSetSession(ctx)
      ctx.Response.StatusCode = 204 'ok - no content
    End Sub

    Private Shared Sub MakeAndSetSession(ctx As HttpContext)
      Dim rnd = New Random
      Dim ba(15) As Byte
      rnd.NextBytes(ba)
      Dim SessID = JAH.HexEncode(ba)
      Sessions.Add(SessID, DateTime.UtcNow)
      ctx.Response.AppendCookie(New HttpCookie("api-session", SessID))
    End Sub

    Private Shared Sub ProcRepoList(ctx As HttpContext)
      If Not CheckCookie(ctx) Then Exit Sub
      If ctx.Request.HttpMethod <> "GET" Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      ctx.Response.ContentType = "application/json"
      Dim s As RepoState
      Dim w As New JhJson.TextWriter(ctx.Response.Output)
      w.BeginArray()
      For Each r In SimpleDeploy.AppCfg.Repos.Values
        s = GetRepoState(r.ID)
        w.BeginObject()
        w.AddProp("id", r.ID)
        w.AddProp("name", r.Name)
        w.AddProp("lasttime", CLng(s.Time.Subtract(#1/1/1970#).TotalMilliseconds))
        w.AddProp("lastres", If(s.Time = #1/1/1970#, -1, If(s.OK, 1, 0)))
        w.EndObject()
      Next
      w.EndArray()
    End Sub

    Private Shared Sub ProcLogout(ctx As HttpContext)
      If ctx.Request.HttpMethod <> "POST" Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      Dim c = ctx.Request.Cookies("api-session")
      If c IsNot Nothing Then Sessions.Remove(c.Value)
      ctx.Response.StatusCode = 204 'ok - no content
    End Sub

    Private Shared Sub ProcRepo(ctx As HttpContext)
      If Not CheckCookie(ctx) Then Exit Sub
      Dim RepoID As Integer
      If Not Integer.TryParse(ctx.Request.QueryString("id"), RepoID) Then SendError(ctx, "URL is missing id query parameter") : Exit Sub
      Dim Repo As SimpleDeploy.RepoConfig = Nothing
      If RepoID > 0 AndAlso Not SimpleDeploy.AppCfg.Repos.TryGetValue(RepoID, Repo) Then ctx.Response.StatusCode = 404 : Exit Sub

      Select Case ctx.Request.HttpMethod
        Case "GET"
          ctx.Response.ContentType = "application/json"
          Repo.Serialize(New JhJson.TextWriter(ctx.Response.Output), False)

        Case "POST"
          Dim ErrMsg As String = Nothing
          Dim o = GetRequestJsonObj(ctx)
          Dim DoPull = o.GetBool("pull")
          Repo = RepoConfig.DeSerialize(o.GetObject("repo"), False)

          While Repo.OutDir.EndsWith("\")
            Repo.OutDir = Repo.OutDir.Substring(0, Repo.OutDir.Length - 1)
          End While

          Dim i = Repo.OutDir.LastIndexOf("\")
          If i < 0 Then SendError(ctx, "Invalid Output directory") : Exit Sub
          Try
            Dim pd = Repo.OutDir.Substring(0, i)
            If Not My.Computer.FileSystem.DirectoryExists(pd) Then SendError(ctx, "Invalid Output directory - Parent directory (" & pd & ") does not exist") : Exit Sub
          Catch ex As Exception
            SendError(ctx, "Invalid Output directory - " & ex.Message)
            Exit Sub
          End Try


          If RepoID = 0 Then
            Repo.ID = AppCfg.NextRepoID
            If Not Repo.Init(ErrMsg) Then SendError(ctx, ErrMsg) : Exit Sub
          End If

          SyncLock SimpleDeploy.AppCfg.Repos
            If RepoID = 0 Then
              RepoID = Repo.ID
              SimpleDeploy.AppCfg.Repos.Add(RepoID, Repo)
              AppCfg.NextRepoID += 1
            Else
              AppCfg.Repos(RepoID) = Repo
            End If
            SimpleDeploy.AppCfg.Save()
          End SyncLock

          If DoPull AndAlso Not Repo.FetchAndMerge(True, ErrMsg) Then SendError(ctx, ErrMsg) : Exit Sub

          ctx.Response.ContentType = "application/json"
          ctx.Response.Write(RepoID.ToString())


        Case "DELETE"
          If RepoID = 0 Then ctx.Response.StatusCode = 404 : Exit Sub
          Dim GitDir = ctx.Server.MapPath("~/App_Data/repository-" & RepoID)
          Try
            My.Computer.FileSystem.DeleteDirectory(GitDir, FileIO.DeleteDirectoryOption.DeleteAllContents)
          Catch
          End Try
          Dim fn = ctx.Server.MapPath("~/App_Data/repository-" & RepoID & "-state.json")
          Try
            My.Computer.FileSystem.DeleteFile(fn)
          Catch
          End Try
          AppCfg.Repos.Remove(RepoID)
          AppCfg.Save()
          ctx.Response.StatusCode = 204 'ok - no content

        Case Else
          ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      End Select

    End Sub

    Private Shared Sub ProcRepoState(ctx As HttpContext)
      If Not CheckCookie(ctx) Then Exit Sub
      If ctx.Request.HttpMethod <> "GET" Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      Dim RepoID As Integer
      If Not Integer.TryParse(ctx.Request.QueryString("id"), RepoID) Then SendError(ctx, "URL is missing id query parameter") : Exit Sub
      If Not SimpleDeploy.AppCfg.Repos.ContainsKey(RepoID) Then ctx.Response.StatusCode = 404 : Exit Sub
      ctx.Response.ContentType = "application/json"
      ctx.Response.Write(GetRepoState(RepoID).Serialize().EncodeJson(False))
    End Sub

    Private Shared Sub ProcAcctList(ctx As HttpContext)
      If Not CheckCookie(ctx) Then Exit Sub
      If ctx.Request.HttpMethod <> "GET" Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      ctx.Response.ContentType = "application/json"
      Dim w As New JhJson.TextWriter(ctx.Response.Output)
      w.BeginArray()
      For Each acct In SimpleDeploy.AppCfg.Accts.Values
        w.BeginObject()
        w.AddProp("id", acct.ID)
        w.AddProp("service", acct.Service)
        w.AddProp("loginid", acct.LoginID)
        w.EndObject()
      Next
      w.EndArray()
    End Sub

    Private Shared Sub ProcAcct(ctx As HttpContext)
      If Not CheckCookie(ctx) Then Exit Sub
      Dim AcctID As Integer
      If Not Integer.TryParse(ctx.Request.QueryString("id"), AcctID) Then SendError(ctx, "URL is missing id query parameter") : Exit Sub
      Dim Acct As SimpleDeploy.AccountConfig = Nothing
      If AcctID > 0 AndAlso Not SimpleDeploy.AppCfg.Accts.TryGetValue(AcctID, Acct) Then ctx.Response.StatusCode = 404 : Exit Sub
      Select Case ctx.Request.HttpMethod
        Case "GET"
          ctx.Response.ContentType = "application/json"
          Acct.Serialize(New JhJson.TextWriter(ctx.Response.Output), False)

        Case "POST"
          Dim o = GetRequestJsonObj(ctx)
          If AcctID = 0 Then Acct = New SimpleDeploy.AccountConfig
          Acct.Service = o.GetString("service")
          Acct.LoginID = o.GetString("loginid")
          Dim gpw = o.GetString("password")
          If AcctID = 0 OrElse gpw <> "*Not*Changed*" Then Acct.Password = gpw
          Acct.Notes = o.GetString("notes")
          SyncLock SimpleDeploy.AppCfg.Repos
            If AcctID = 0 Then
              AcctID = AppCfg.NextAcctID
              AppCfg.NextAcctID += 1
              Acct.ID = AcctID
              SimpleDeploy.AppCfg.Accts.Add(AcctID, Acct)
            End If
            SimpleDeploy.AppCfg.Save()
          End SyncLock
          ctx.Response.ContentType = "application/json"
          ctx.Response.Write(AcctID.ToString)

        Case "DELETE"
          If AcctID = 0 Then ctx.Response.StatusCode = 404 : Exit Sub
          For Each r In AppCfg.Repos.Values
            If r.Account = AcctID Then SendError(ctx, "Account is used for one or more repositories") : Exit Sub
          Next
          AppCfg.Accts.Remove(AcctID)
          AppCfg.Save()
          ctx.Response.StatusCode = 204 'ok - no content

        Case Else
          ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      End Select
    End Sub

    Private Shared Sub ProcSettings(ctx As HttpContext)
      If Not CheckCookie(ctx) Then Exit Sub
      Select Case ctx.Request.HttpMethod
        Case "GET"
          ctx.Response.ContentType = "application/json"
          Dim w = New JhJson.TextWriter(ctx.Response.Output)
          w.BeginObject()
          w.AddProp("servername", AppCfg.ServerName)
          w.AddProp("gitexeloc", AppCfg.GitExeLoc)
          w.AddProp("notes", AppCfg.Notes)
          w.AddProp("forcessl", AppCfg.ForceSSL)

          w.EndObject()

        Case "POST"
          Dim o = GetRequestJsonObj(ctx)
          Dim ExeLoc = o.GetString("gitexeloc")
          If ExeLoc.Length > 0 Then
            Try
              If Not My.Computer.FileSystem.FileExists(ExeLoc) Then SendError(ctx, "Git.exe does not exist at specified location") : Exit Sub
            Catch ex As Exception
              SendError(ctx, "Error checking git.exe location: " & ex.Message)
              Exit Sub
            End Try
          End If

          SyncLock SimpleDeploy.AppCfg.Repos
            AppCfg.ServerName = o.GetString("servername")
            AppCfg.GitExeLoc = ExeLoc
            AppCfg.ForceSSL = o.GetBool("forcessl")
            AppCfg.Notes = o.GetString("notes")
            SimpleDeploy.AppCfg.Save()
          End SyncLock
          ctx.Response.StatusCode = 204 'ok - no content

        Case Else
          ctx.Response.StatusCode = 405 ' method not allowed
      End Select
    End Sub


    Private Shared Sub ProcPW(ctx As HttpContext)
      If AppCfg.AdminPwHash.Length > 0 AndAlso Not CheckCookie(ctx) Then Exit Sub
      If ctx.Request.HttpMethod <> "POST" Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
      Dim o = GetRequestJsonObj(ctx)
      Dim CurPW = o.GetString("cur")
      Dim NewPW = o.GetString("new")
      If NewPW.Length = 0 Then SendError(ctx, "New password is empty") : Exit Sub
      ctx.Response.ContentType = "application/json"
      If AppCfg.AdminPwHash.Length > 0 AndAlso SimpleDeploy.HashAdminPW(CurPW) <> SimpleDeploy.AppCfg.AdminPwHash Then SendError(ctx, "Current password is incorrect") : Exit Sub
      If AppCfg.AdminPwHash.Length = 0 Then MakeAndSetSession(ctx)
      AppCfg.AdminPwHash = SimpleDeploy.HashAdminPW(NewPW)
      SimpleDeploy.AppCfg.Save()
      ctx.Response.StatusCode = 204 'ok - no content
    End Sub

  End Class


End Class

