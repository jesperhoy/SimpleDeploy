Option Strict On

Partial Class SimpleDeploy

  Public Shared AppCfg As AppConfig

  Class AppConfig
    Public Repos As New Dictionary(Of Integer, RepoConfig)
    Public Accts As New Dictionary(Of Integer, AccountConfig)
    Public AdminPwHash As String = ""
    Public ServerName As String = My.Computer.Name
    Public Notes As String = ""
    Public GitExeLoc As String = ""
    Public ForceSSL As Boolean = False
    Public NextRepoID As Integer = 1
    Public NextAcctID As Integer = 1

    Public Sub Save()
      Dim ctx = HttpContext.Current
      My.Computer.FileSystem.CreateDirectory(ctx.Server.MapPath("~/App_Data"))
      Dim fn = ctx.Server.MapPath("~/App_Data/config.json")
      Dim f = My.Computer.FileSystem.OpenTextFileWriter(fn, False)
      Dim wrtr As New JhJson.TextWriter(f)
      wrtr.BeginObject()

      wrtr.AddPropName("repos")
      wrtr.BeginArray()
      For Each r In Repos.Values
        r.Serialize(wrtr, True)
      Next
      wrtr.EndArray()

      wrtr.AddPropName("accounts")
      wrtr.BeginArray()
      For Each a In Accts.Values
        a.Serialize(wrtr, True)
      Next
      wrtr.EndArray()

      wrtr.AddProp("adminpw", AdminPwHash)
      wrtr.AddProp("servername", ServerName)
      wrtr.AddProp("gitexeloc", GitExeLoc)
      wrtr.AddProp("notes", Notes)
      wrtr.AddProp("forcessl", ForceSSL)
      wrtr.AddProp("nextrepoid", NextRepoID)
      wrtr.AddProp("nextacctid", NextAcctID)

      wrtr.EndObject()
      f.Close()
    End Sub

    Public Shared Function Load() As AppConfig
      Dim fn = HttpContext.Current.Server.MapPath("~/App_Data/config.json")
      Dim x As String
      Try
        x = My.Computer.FileSystem.ReadAllText(fn)
      Catch ex As System.IO.FileNotFoundException
        Return New AppConfig
      Catch ex As System.IO.DirectoryNotFoundException
        Return New AppConfig
      End Try

      Dim obj = DirectCast(JhJson.Parse(x), JhJson.Object)

      Dim rv = New AppConfig

      Dim arr = obj.GetArray("repos")
      Dim r As RepoConfig
      For Each v In arr
        r = RepoConfig.DeSerialize(DirectCast(v, JhJson.Object), True)
        rv.Repos.Add(r.ID, r)
      Next

      arr = obj.GetArray("accounts")
      Dim a As AccountConfig
      For Each v In arr
        a = AccountConfig.DeSerialize(DirectCast(v, JhJson.Object), True)
        rv.Accts.Add(a.ID, a)
      Next

      rv.AdminPwHash = obj.GetString("adminpw", "")
      rv.ServerName = obj.GetString("servername", My.Computer.Name)
      rv.GitExeLoc = obj.GetString("gitexeloc", "")
      rv.Notes = obj.GetString("notes", "")
      rv.ForceSSL = obj.GetBool("forcessl", False)
      rv.NextRepoID = obj.GetInt("nextrepoid", 3)
      rv.NextAcctID = obj.GetInt("nextacctid", 3)

      Return rv
    End Function

  End Class

  Public Class AccountConfig
    Public ID As Integer
    Public Service As String
    Public LoginID As String
    Public Password As String
    Public Notes As String
    Public Sub Serialize(wrtr As JhJson.TextWriter, forCfgFile As Boolean)
      wrtr.BeginObject()
      wrtr.AddProp("id", ID)
      wrtr.AddProp("service", Service)
      wrtr.AddProp("loginid", LoginID)
      If forCfgFile Then
        wrtr.AddProp("pwhash", PwScramble(Password))
      Else
        wrtr.AddProp("password", "*Not*Changed*")
      End If
      wrtr.AddProp("notes", Notes)
      wrtr.EndObject()
    End Sub
    Public Shared Function DeSerialize(o As JhJson.Object, fromCfgFile As Boolean) As AccountConfig
      Dim rv = New AccountConfig
      rv.ID = o.GetInt("id")
      rv.Service = o.GetString("service")
      rv.LoginID = o.GetString("loginid")
      If fromCfgFile Then
        rv.Password = PwDeScramble(o.GetString("pwhash"))
      Else
      End If
      rv.Notes = o.GetString("notes")
      Return rv
    End Function
  End Class

  Public Class RepoConfig
    Public ID As Integer
    Public Name As String = ""
    Public GitUrl As String = ""
    Public Account As Integer = 0
    Public Branch As String = "master"
    Public OutDir As String = ""
    Public HookSecret As String = ""
    Public HookMethod As String = "POST"
    Public Notes As String = ""

    Public Sub Serialize(wrtr As JhJson.TextWriter, toCfgFile As Boolean)
      wrtr.BeginObject()
      wrtr.AddProp("id", ID)
      wrtr.AddProp("name", Name)
      wrtr.AddProp("giturl", GitUrl)
      wrtr.AddProp("account", Account)
      wrtr.AddProp("branch", Branch)
      wrtr.AddProp("outdir", OutDir)
      wrtr.AddProp("hooksecret", If(toCfgFile, PwScramble(HookSecret), HookSecret))
      wrtr.AddProp("hookmethod", HookMethod)
      wrtr.AddProp("notes", Notes)
      wrtr.EndObject()
    End Sub

    Public Shared Function DeSerialize(o As JhJson.Object, fromCfgFile As Boolean) As RepoConfig
      Dim rv = New RepoConfig
      rv.ID = o.GetInt("id")
      rv.Name = o.GetString("name")
      rv.GitUrl = o.GetString("giturl")
      rv.Account = o.GetInt("account")
      rv.Branch = o.GetString("branch")
      rv.OutDir = o.GetString("outdir").Replace("/", "\")
      rv.HookSecret = If(fromCfgFile, PwDeScramble(o.GetString("hooksecret")), o.GetString("hooksecret"))
      rv.HookMethod = o.GetString("hookmethod", "POST")
      rv.Notes = o.GetString("notes")
      Return rv
    End Function

  End Class

  Private Shared Function PwScramble(x As String) As String
    Dim ba1 = System.Text.Encoding.UTF8.GetBytes(x)
    Dim ba2(ba1.Length - 1) As Byte
    Dim v As Byte = 34
    For i = 0 To ba1.Length - 1
      v = v Xor ba1(i)
      ba2(i) = v
    Next
    Return System.Convert.ToBase64String(ba2)
  End Function

  Private Shared Function PwDeScramble(x As String) As String
    Dim ba1 = System.Convert.FromBase64String(x)
    Dim ba2(ba1.Length - 1) As Byte
    Dim v As Byte = 34
    For i = 0 To ba1.Length - 1
      ba2(i) = v Xor ba1(i)
      v = ba1(i)
    Next
    Return System.Text.Encoding.UTF8.GetString(ba2)
  End Function

End Class
