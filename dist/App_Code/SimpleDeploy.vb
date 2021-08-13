Option Strict On

Public Class SimpleDeploy

  Public Shared ReadOnly Version As Version = New Version(0, 9, 1)

  Public Shared RepoStates As New Dictionary(Of Integer, RepoState)

  Public Shared Function GetRepoState(id As Integer) As RepoState
    Dim s As RepoState = Nothing
    If RepoStates.TryGetValue(id, s) Then Return s
    Dim ctx = HttpContext.Current
    Dim fn = ctx.Server.MapPath("~/App_Data/repository-" & id.ToString() & "-state.json")
    Dim x As String
    Try
      x = My.Computer.FileSystem.ReadAllText(fn)
    Catch ex As System.IO.FileNotFoundException
      s = New RepoState
      RepoStates.Add(id, s)
      Return s
    End Try
    s = RepoState.DeSerialize(DirectCast(JhJson.Parse(x), JhJson.Object))
    RepoStates.Add(id, s)
    Return s
  End Function

  Public Shared Function GitExePath() As String
    If AppCfg.GitExeLoc.Length > 0 Then Return AppCfg.GitExeLoc
    Dim pf = Environment.GetFolderPath(System.Environment.SpecialFolder.ProgramFiles)
    Dim rv = pf & "\Git\cmd\git.exe"
    If My.Computer.FileSystem.FileExists(rv) Then Return rv
    Dim pfX86 = Environment.GetFolderPath(System.Environment.SpecialFolder.ProgramFilesX86)
    If pf <> pfX86 Then
      rv = pfX86 & "\Git\cmd\git.exe"
      If My.Computer.FileSystem.FileExists(rv) Then Return rv
    End If
    rv = "c:\program files\git\cmd\git.exe"
    If My.Computer.FileSystem.FileExists(rv) Then Return rv
    Return Nothing
  End Function

  Public Shared Function HashAdminPW(x As String) As String
    Dim sha1 = System.Security.Cryptography.SHA1.Create()
    Dim rv = sha1.ComputeHash(System.Text.Encoding.UTF8.GetBytes(x & "SaltyFish"))
    Return System.Convert.ToBase64String(rv)
  End Function

  Public Shared Function ExecCmd(file As String, args As String) As ExecCmdResult
    Dim rv = New ExecCmdResult
    Try
      Dim psi = New System.Diagnostics.ProcessStartInfo(file, args)
      psi.RedirectStandardOutput = True
      psi.RedirectStandardError = True
      psi.RedirectStandardInput = True
      psi.Environment.Add("GIT_TERMINAL_PROMPT", "0")
      psi.UseShellExecute = False
      psi.CreateNoWindow = True
      Dim proc = New System.Diagnostics.Process()
      proc.StartInfo = psi
      proc.Start()
      rv.StdOut = proc.StandardOutput.ReadToEnd()
      rv.StdErr = proc.StandardError.ReadToEnd()
      rv.ExitCode = proc.ExitCode
    Catch ex As Exception
      rv.Exception = ex
    End Try
    Return rv
  End Function

  Public Class ExecCmdResult
    Public StdOut As String
    Public StdErr As String
    Public ExitCode As Integer
    Public Exception As Exception
  End Class

  Public Shared Sub ProcHookReq(ctx As HttpContext)
    Dim x = ctx.Request.Url.AbsolutePath
    x = x.Substring(x.LastIndexOf("/") + 1)
    If Not x.StartsWith("hook-") Then ctx.Response.StatusCode = 404 : Exit Sub
    x = x.Substring(5)
    Dim i = x.IndexOf("-")
    If i < 0 Then ctx.Response.StatusCode = 404 : Exit Sub
    Dim RepoID = Integer.Parse(x.Substring(0, i))
    Dim Repo As RepoConfig = Nothing
    If Not AppCfg.Repos.TryGetValue(RepoID, Repo) Then ctx.Response.StatusCode = 404 : Exit Sub
    If Repo.HookSecret <> x.Substring(i + 1) Then ctx.Response.StatusCode = 404 : Exit Sub
    If Repo.HookMethod <> "*" AndAlso Repo.HookMethod <> ctx.Request.HttpMethod Then ctx.Response.StatusCode = 405 : Exit Sub ' method not allowed
    Dim ErrMsg As String = Nothing
    Repo.FetchAndMerge(False, ErrMsg)
    ctx.Response.ContentType = "text/plain"
    ctx.Response.Write("Thank you :-)")
  End Sub

End Class
