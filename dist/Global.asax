<%@ Application Language="VB" %>

<script runat="server">

  Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
    SimpleDeploy.AppCfg = SimpleDeploy.AppConfig.Load()
    SimpleDeploy.VueApi.Init()
    JAH.AddRoute("hook-{id}-{secret}", AddressOf SimpleDeploy.ProcHookReq)
  End Sub

</script>