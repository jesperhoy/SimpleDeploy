
Partial Class _Default
  Inherits System.Web.UI.Page

  Private Sub _Default_Load(sender As Object, e As EventArgs) Handles Me.Load
    If SimpleDeploy.AppCfg.ForceSSL AndAlso Not Request.IsSecureConnection Then
      Response.Redirect("https://" & Request.Url.Authority & Request.RawUrl)
    End If
  End Sub
End Class
