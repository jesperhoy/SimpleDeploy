<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="_Default" %>

<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Simple Deploy</title>
  <link href="<%=JAH.StaticFileHash("css/simpledeploy.css")%>" rel="stylesheet"/>
  <script src="<%=JAH.StaticFileHash(If(Request.IsLocal, "scripts/vue.js", "scripts/vue.runtime.min.js"))%>"></script>
  <script src="<%=JAH.StaticFileHash("scripts/bootstrap.min.js")%>"></script>
</head>
<body style="background-color:#DDD">

<div id="app"></div>

<script>
let SimpleDeployVer=<%=(New JhJson.String(SimpleDeploy.Version.ToString())).EncodeJson()%>;
let SimpleDeploySN=<%=(New JhJson.String(SimpleDeploy.AppCfg.ServerName)).EncodeJson()%>;
</script>
<script src="<%=JAH.StaticFileHash("scripts/simpledeploy.js")%>"></script>

</body>
</html>