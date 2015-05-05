<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="expires" content="-1" />
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="copyright" content="2015, Web Site Management" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" >
	<title>Publication Package Manager</title>
	<link rel="stylesheet" href="css/bootstrap.min.css" />
	<link rel="stylesheet" href="css/custom.css" />
	<link rel="stylesheet" href="css/bootstrap-responsive.css" />
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/handlebars-v2.0.0.js"></script>
	<script type="text/javascript" src="rqlconnector/Rqlconnector.js"></script>
	<script type="text/javascript" src="js/publication-package-manager.js"></script>

	<script id="template-publication-packages" type="text/x-handlebars-template" data-container=".publication-packages" data-action="replace">
		{{#each publicationpackages}}
		<div data-guid="{{guid}}" class="{{guid}} publication-package">
			<div class="row-fluid">
				<div class="span12 alert alert-info">
					<span><i class="icon-th-list"></i> {{name}}</span>
				</div>
			</div>
			<div class="project-language-variants">
				<div class="used">
				</div>
				<div class="unused">
				</div>
			</div>
		</div>
		{{/each}}
	</script>
	
	<script id="template-publication-package-project-language-variants-used-loading" type="text/x-handlebars-template" data-container=".publication-package .project-language-variants .used" data-action="replace">
		<div class="row-fluid">
			<div class="span11 offset1 alert">Loading...</div>
		</div>
	</script>
	
	<script id="template-publication-package-project-language-variants-unused-loading" type="text/x-handlebars-template" data-container=".publication-package .project-language-variants .unused" data-action="replace">
		<div class="row-fluid">
			<div class="span11 offset1 alert">Loading...</div>
		</div>
	</script>
	
	<script id="template-publication-package-project-language-variants-used" type="text/x-handlebars-template" data-container=".publication-package .project-language-variants .used" data-action="replace">
		{{#each publicationpackageprojectlanguagevariantsused}}
		<div class="row-fluid">
			<div class="span6 offset1 alert alert-success project-language-variant" data-guid="{{guid}}" data-project-variant-guid="{{projectvariantguid}}" data-language-variant-guid="{{languagevariantguid}}" data-name="{{name}}">{{name}}</div>
			<div data-guid="{{guid}}" class="span5 alert alert-success project-language-variant-target">
				<label class="checkbox"><input type="checkbox"> {{publicationtargetnames}}</label>
			</div>
		</div>
		{{/each}}
	</script>
	
	<script id="template-publication-package-project-language-variants-unused" type="text/x-handlebars-template" data-container=".publication-package .project-language-variants .unused" data-action="replace">
		{{#each publicationpackageprojectlanguagevariantsunused}}
		<div class="row-fluid">
			<div class="span6 offset1 alert alert-danger project-language-variant" data-project-variant-guid="{{projectvariantguid}}" data-language-variant-guid="{{languagevariantguid}}">
				<label class="checkbox"><input type="checkbox"> {{name}}</label>
			</div>
		</div>
		{{/each}}
	</script>
	
	<script id="template-enable-project-language-variants-dialog-used-project-language-variants" type="text/x-handlebars-template" data-container="#enable-project-language-variants-dialog .used-project-language-variants" data-action="replace">
		<select>
			<option data-guid="" data-project-variant-guid="" data-language-variant-guid="">None</option>
			{{#each publicationpackageprojectlanguagevariantsused}}
			<option data-guid="{{guid}}" data-project-variant-guid="{{projectvariantguid}}" data-language-variant-guid="{{languagevariantguid}}">{{name}}</option>
			{{/each}}
		</select>
	</script>
	
	<script id="template-change-publication-target-dialog-publication-targets" type="text/x-handlebars-template" data-container="#change-publication-target-dialog .publication-targets" data-action="replace">
		{{#each publicationtargets}}
		<div>
			<label class="checkbox"><input type="checkbox" data-target-guid="{{targetguid}}"> {{targetname}}</label>
		</div>
		{{/each}}
	</script>
	
	<script id="template-enable-project-language-variants-dialog" type="text/x-handlebars-template" data-container="#enable-project-language-variants-dialog" data-action="replace">
		<div class="modal fade" tabindex="-1" role="dialog">
			<div class="modal-header">
				<h3>Enable Project Language Variants</h3>
			</div>
			<div class="modal-body">
				<div class="form-horizontal">
					<div class="control-group">
						<label class="control-label">Copy settings</label>
						<div class="controls used-project-language-variants">
							<div class="alert">Loading...</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="btn" data-dismiss="modal">Close</div>
				<div class="btn btn-success enable" data-dismiss="modal">Enable</div>
			</div>
		</div>
	</script>
	
	<script id="template-change-publication-target-dialog" type="text/x-handlebars-template" data-container="#change-publication-target-dialog" data-action="replace">
		<div class="modal fade" tabindex="-1" role="dialog">
			<div class="modal-header">
				<h3>Change Publication Target</h3>
			</div>
			<div class="modal-body">
				<div class="form-horizontal">
					<div class="control-group">
						<label class="control-label">Publication Targets</label>
						<div class="controls publication-targets">
							<div class="alert">Loading...</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="btn" data-dismiss="modal">Close</div>
				<div class="btn btn-success change" data-dismiss="modal">Change</div>
			</div>
		</div>
	</script>
	
	<script type="text/javascript">
		var LoginGuid = '<%= session("loginguid") %>';
		var SessionKey = '<%= session("sessionkey") %>';
		var RqlConnectorObj = new RqlConnector(LoginGuid, SessionKey);
		
		$(document).ready(function() {
			var PublicationPackageManagerObj = new PublicationPackageManager(RqlConnectorObj);
		});
	</script>
</head>
<body>
	<div id="enable-project-language-variants-dialog">
	
	</div>
	<div id="change-publication-target-dialog">
	
	</div>

	<div class="navbar navbar-inverse navbar-fixed-top">
		<div class="navbar-inner">
			<div class="navbar-padding">
				<div class="container">
					<div class="row-fluid">
						<div class="span6 offset1">
							<div class="btn btn-danger enable-project-language-variants" type="button">Enable Project Language Variant</div>
						</div>
						<div class="span5">
							<div class="btn btn-danger change-publication-target" type="button">Change Publication Target</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="container publication-packages">
		<div class="alert">Loading...</div>
	</div>
</body>
</html>