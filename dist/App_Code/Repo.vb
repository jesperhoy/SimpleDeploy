Option Strict On

Partial Public Class SimpleDeploy

  Partial Class RepoConfig

    Public Function Init(ByRef output As String) As Boolean
      Dim GitExe = SimpleDeploy.GitExePath
      If GitExe Is Nothing Then output = "Could not find git.exe (see Settings)" : Return False

      Dim GitDir = HttpContext.Current.Server.MapPath("~/App_Data/repository-" & ID)
      Dim res = SimpleDeploy.ExecCmd(GitExe,
              """--git-dir=" & GitDir.Replace("\", "/") & """ " &
              "init --bare")
      If res.Exception IsNot Nothing Then output = "Error executing Git init: " & res.Exception.Message : Return False
      If res.ExitCode <> 0 Then output = "Git init returned exit code " & res.ExitCode & vbCrLf & res.StdErr : Return False

      output = (res.StdOut & vbCrLf & res.StdErr).Trim()
      Return True
    End Function

    Public Function FetchAndMerge(fromUI As Boolean, ByRef ErrMsg As String) As Boolean
      ErrMsg = Nothing
      Dim Output As String = Nothing

      Dim GitExe = SimpleDeploy.GitExePath
      If GitExe Is Nothing Then ErrMsg = "Could not find git.exe (see Settings)" : GoTo markExit

      Dim ctx = HttpContext.Current
      Dim GitDir = ctx.Server.MapPath("~/App_Data/repository-" & ID)

      Dim UrlWithAuth = GitUrl
      If Account > 0 Then
        Dim Acct = AppCfg.Accts(Account)
        Dim i = If(UrlWithAuth.StartsWith("https"), 8, 7)
        UrlWithAuth = UrlWithAuth.Substring(0, i) &
                    ctx.Server.UrlEncode(Acct.LoginID) & ":" & ctx.Server.UrlEncode(Acct.Password) & "@" &
                    UrlWithAuth.Substring(i)
      End If
      Dim res = SimpleDeploy.ExecCmd(GitExe,
              """--git-dir=" & GitDir.Replace("\", "/") & """ " &
              "-c credential.helper="""" " &
              "fetch " &
              """" & UrlWithAuth & """ " &
              """" & Branch & """")
      If res.Exception IsNot Nothing Then ErrMsg = "Error executing Git fetch: " & res.Exception.Message : GoTo markExit
      If res.ExitCode <> 0 Then ErrMsg = "Git fetch returned exit code " & res.ExitCode & vbCrLf & res.StdErr : GoTo markExit

      Try
        My.Computer.FileSystem.CreateDirectory(OutDir)
      Catch ex As Exception
        ErrMsg = "Error creating output directory (" & OutDir & "): " & ex.Message
        GoTo markExit
      End Try

      Dim res2 = SimpleDeploy.ExecCmd(GitExe,
              """--work-tree=" & OutDir.Replace("\", "/") & """ " &
              """--git-dir=" & GitDir.Replace("\", "/") & """ " &
              "-c advice.detachedHead=false " &
              "checkout -f FETCH_HEAD")
      If res2.Exception IsNot Nothing Then ErrMsg = "Error executing Git checkout: " & res2.Exception.Message : GoTo markExit
      If res2.ExitCode <> 0 Then ErrMsg = "Git checkout returned exit code " & res2.ExitCode & vbCrLf & res2.StdErr : GoTo markExit

      Output = "Git fetch:" & vbCrLf &
               (res.StdOut & vbCrLf & res.StdErr).Trim() & vbCrLf &
               vbCrLf &
               "Git checkout:" & vbCrLf &
               (res2.StdOut & vbCrLf & res2.StdErr).Trim()

markExit:
      Dim s = GetRepoState(ID)
      s.Time = DateTime.UtcNow
      s.OK = ErrMsg Is Nothing
      s.Output = If(s.OK, Output, ErrMsg)
      s.WasUI = fromUI
      If s.OK Then s.LastSuccess = DateTime.UtcNow
      s.Save(ID)
      Return s.OK
    End Function

  End Class

End Class

Public Class RepoState
  Public Time As DateTime = #1/1/1970#
  Public OK As Boolean
  Public Output As String = ""
  Public WasUI As Boolean
  Public LastSuccess As DateTime = #1/1/1970#

  Public Sub Save(id As Integer)
    Dim ctx = HttpContext.Current
    Dim fn = ctx.Server.MapPath("~/App_Data/repository-" & id.ToString() & "-state.json")
    My.Computer.FileSystem.WriteAllText(fn, Serialize().EncodeJson(True), False)
  End Sub

  Public Function Serialize() As JhJson.Object
    Dim rv = New JhJson.Object
    rv.Add("time", CLng(Time.Subtract(#1/1/1970#).TotalMilliseconds))
    rv.Add("ok", OK)
    rv.Add("output", Output)
    rv.Add("ui", WasUI)
    rv.Add("lastsuccess", CLng(LastSuccess.Subtract(#1/1/1970#).TotalMilliseconds))
    Return rv
  End Function

  Public Shared Function DeSerialize(o As JhJson.Object) As RepoState
    Dim rv = New RepoState
    rv.Time = #1/1/1970#.AddMilliseconds(o.GetInt64("time", 0))
    rv.OK = o.GetBool("ok")
    rv.Output = o.GetString("output")
    rv.WasUI = o.GetBool("ui", True)
    rv.LastSuccess = #1/1/1970#.AddMilliseconds(o.GetInt64("lastsuccess", 0))
    Return rv
  End Function

End Class

