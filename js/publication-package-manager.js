function PublicationPackageManager(RqlConnectorObj) {
	var ThisClass = this;;
	this.RqlConnectorObj = RqlConnectorObj;
	
	this.TemplatePublicationPackages = '#template-publication-packages';
	this.TemplatePublicationPackageProjectLanguageVariantsUsed = '#template-publication-package-project-language-variants-used';
	this.TemplatePublicationPackageProjectLanguageVariantsUnused = '#template-publication-package-project-language-variants-unused';
	this.TemplatePublicationPackageProjectLanguageVariantsUsedLoading = '#template-publication-package-project-language-variants-used-loading';
	this.TemplatePublicationPackageProjectLanguageVariantsUnusedLoading = '#template-publication-package-project-language-variants-unused-loading';
	this.TemplateEnableProjectLanguageVariantsDialogUsedProjectLanguageVariants = '#template-enable-project-language-variants-dialog-used-project-language-variants';
	this.TemplateEnableProjectLanguageVariantsDialog = '#template-enable-project-language-variants-dialog';
	this.TemplateChangePublicationTargetDialogPublicationTargets = '#template-change-publication-target-dialog-publication-targets';
	this.TemplateChangePublicationTargetDialog = '#template-change-publication-target-dialog';

	this.ListPublicationPackages();
	
	$('body').on('click', '.enable-project-language-variants', function(){
		ThisClass.EnableProjectLanguageVariantsDialog();
	});
	
	var EnableProjectLanguageVariantsDialogContainer = $(this.TemplateEnableProjectLanguageVariantsDialog).attr('data-container');
	$(EnableProjectLanguageVariantsDialogContainer).on('click', '.enable', function(){
		ThisClass.EnableProjectLanguageVariants();
	});
	
	$('body').on('click', '.change-publication-target', function(){
		ThisClass.ChangePublicationTargetDialog();
	});
	
	var ChangePublicationTargetDialogContainer = $(this.TemplateChangePublicationTargetDialog).attr('data-container');
	$(ChangePublicationTargetDialogContainer).on('click', '.change', function(){
		ThisClass.ChangePublicationTargets();
	});
}

PublicationPackageManager.prototype.EnableProjectLanguageVariantsDialog = function() {
	var FirstPublicationPackageGuid = $('.publication-package:first').attr('data-guid');
	if(FirstPublicationPackageGuid){
		this.UpdateArea(this.TemplateEnableProjectLanguageVariantsDialog, undefined, {});
		var EnableProjectLanguageVariantsDialogContainer = $(this.TemplateEnableProjectLanguageVariantsDialog).attr('data-container');
		$(EnableProjectLanguageVariantsDialogContainer).find('.modal').modal('show');
	
		this.ListPublicationPackageProjectLanguageVariantsForCopy(FirstPublicationPackageGuid);
	}
}

PublicationPackageManager.prototype.ChangePublicationTargetDialog = function() {
	var FirstPublicationPackageGuid = $('.publication-package:first').attr('data-guid');
	if(FirstPublicationPackageGuid){
		this.UpdateArea(this.TemplateChangePublicationTargetDialog, undefined, {});
		var ChangePublicationTargetDialogContainer = $(this.TemplateChangePublicationTargetDialog).attr('data-container');
		$(ChangePublicationTargetDialogContainer).find('.modal').modal('show');
	
		this.ListPublicationTargets(FirstPublicationPackageGuid);
	}
}

PublicationPackageManager.prototype.EnableProjectLanguageVariants = function() {
	var ThisClass = this;

	var EnableProjectLanguageVariantsDialogUsedProjectLanguageVariantsContainer = $(this.TemplateEnableProjectLanguageVariantsDialogUsedProjectLanguageVariants).attr('data-container');
	var TargetProjectLanguageVariantName = $(EnableProjectLanguageVariantsDialogUsedProjectLanguageVariantsContainer).find('option:selected').text();

	var PublicationPackageProjectLanguageVariantsUnusedContainer = $(this.TemplatePublicationPackageProjectLanguageVariantsUnused).attr('data-container');
	$(PublicationPackageProjectLanguageVariantsUnusedContainer).find('input:checked').each(function(){	
		var PublicationPackageGuid = $(this).closest('.publication-package').attr('data-guid');
		
		var NewProjectLanguageVariantDom = $(this).closest('.project-language-variant');
		var NewProjectVariantGuid = NewProjectLanguageVariantDom.attr('data-project-variant-guid');
		var NewLanguageVariantGuid = NewProjectLanguageVariantDom.attr('data-language-variant-guid');
		
		var PublicationPackageProjectLanguageVariantsUsedContainer = $(ThisClass.TemplatePublicationPackageProjectLanguageVariantsUsed).attr('data-container');
		var TargetProjectLanguageVariantDom = $('.' + PublicationPackageGuid + '' + PublicationPackageProjectLanguageVariantsUsedContainer).find('[data-name="' + TargetProjectLanguageVariantName + '"]');
		var TargetProjectVariantGuid = TargetProjectLanguageVariantDom.attr('data-project-variant-guid');
		var TargetLangugageVariantGuid = TargetProjectLanguageVariantDom.attr('data-language-variant-guid');
		
		ThisClass.CopyProjectLanguageVariant(PublicationPackageGuid, NewProjectVariantGuid, NewLanguageVariantGuid, TargetProjectVariantGuid, TargetLangugageVariantGuid);
	});
}

PublicationPackageManager.prototype.ListPublicationTargets = function() {
	var ThisClass = this;
	var RqlXml = '<PROJECT><EXPORTS action="list" /></PROJECT>';
	
	RqlConnectorObj.SendRql(RqlXml, false, function(data){
		var PublicationTargets = [];
		$(data).find('EXPORT').each(function(){
			var PublicationTarget = {
				'targetname': $(this).attr('name'),
				'targetguid': $(this).attr('guid')
			}
			
			PublicationTargets.push(PublicationTarget);
		});

		ThisClass.UpdateArea(ThisClass.TemplateChangePublicationTargetDialogPublicationTargets, undefined, {'publicationtargets': PublicationTargets});
	});
}
		
PublicationPackageManager.prototype.ListPublicationPackages = function() {
	var ThisClass = this;
	var RqlXml = '<PROJECT><EXPORTPACKET action="list"/></PROJECT>';
	
	RqlConnectorObj.SendRql(RqlXml, false, function(data){
		var PublicationPackages = [];
		$(data).find('EXPORTPACKET').each(function(){
			var PublicationPackage = {
				'name': $(this).attr('name'),
				'guid': $(this).attr('guid')
			}
			
			PublicationPackages.push(PublicationPackage);
		});

		ThisClass.UpdateArea(ThisClass.TemplatePublicationPackages, undefined, {'publicationpackages': PublicationPackages});
		
		$.each(PublicationPackages, function(){
			ThisClass.ListPublicationPackageProjectLanguageVariantsAll(this.guid);
		});
		
	});
}

PublicationPackageManager.prototype.ListPublicationPackageProjectLanguageVariantsAll = function(PublicationPackageGuid) {
	this.ListPublicationPackageProjectLanguageVariantsUsed(PublicationPackageGuid);
	this.ListPublicationPackageProjectLanguageVariantsUnused(PublicationPackageGuid);
}


PublicationPackageManager.prototype.ListPublicationPackageProjectLanguageVariantsUsed = function(PublicationPackageGuid) {
	var PublicationPackageProjectLanguageVariantsUsedLoadingContainer = '.' + PublicationPackageGuid + $(this.TemplatePublicationPackageProjectLanguageVariantsUsedLoading).attr('data-container');
	this.UpdateArea(this.TemplatePublicationPackageProjectLanguageVariantsUsedLoading, PublicationPackageProjectLanguageVariantsUsedLoadingContainer, undefined);

	var ThisClass = this;
	var RqlXml = '<PROJECT><EXPORTPACKET action="loadpacket" guid="' + PublicationPackageGuid + '" /></PROJECT>';
  
	RqlConnectorObj.SendRql(RqlXml, false, function(data){
		var PublicationPackageProjectLanguageVariantsUsed = [];
		$(data).find('EXPORTSETTING').each(function(){
			var PublicationTargetNames = [];
			$(this).find('EXPORTTARGET').each(function(){
				PublicationTargetNames.push($(this).attr('name'));
			});
			
			var PublicationPackageProjectLanguageVariantUsed = {
				'guid': $(this).attr('guid'),
				'projectvariantguid': $(this).attr('projectvariantguid'),
				'languagevariantguid': $(this).attr('languagevariantguid'),
				'name': $(this).attr('projectvariantname') + '/' + $(this).attr('languagevariantname'),
				'publicationtargetnames': PublicationTargetNames.join(', ')
			}
			
			PublicationPackageProjectLanguageVariantsUsed.push(PublicationPackageProjectLanguageVariantUsed);
		});
		
		var PublicationPackageProjectLanguageVariantsUsedContainer = '.' + PublicationPackageGuid + $(ThisClass.TemplatePublicationPackageProjectLanguageVariantsUsed).attr('data-container');
		ThisClass.UpdateArea(ThisClass.TemplatePublicationPackageProjectLanguageVariantsUsed, PublicationPackageProjectLanguageVariantsUsedContainer, {'publicationpackageprojectlanguagevariantsused': PublicationPackageProjectLanguageVariantsUsed});
	});
}

PublicationPackageManager.prototype.ListPublicationPackageProjectLanguageVariantsForCopy = function(PublicationPackageGuid) {
	var ThisClass = this;
	var RqlXml = '<PROJECT><EXPORTSETTINGS action="list" guid="' + PublicationPackageGuid + '" /></PROJECT>';
  
	RqlConnectorObj.SendRql(RqlXml, false, function(data){
		var PublicationPackageProjectLanguageVariantsUsed = [];
		$(data).find('USEDSETTING').each(function(){
			var PublicationPackageProjectLanguageVariantUsed = {
				'guid': $(this).attr('guid'),
				'projectvariantguid': $(this).attr('projectvariantguid'),
				'languagevariantguid': $(this).attr('languagevariantguid'),
				'name': $(this).attr('name')
			}
			
			PublicationPackageProjectLanguageVariantsUsed.push(PublicationPackageProjectLanguageVariantUsed);
		});
		
		ThisClass.UpdateArea(ThisClass.TemplateEnableProjectLanguageVariantsDialogUsedProjectLanguageVariants, undefined, {'publicationpackageprojectlanguagevariantsused': PublicationPackageProjectLanguageVariantsUsed});
	});
}

PublicationPackageManager.prototype.ListPublicationPackageProjectLanguageVariantsUnused = function(PublicationPackageGuid) {
	var PublicationPackageProjectLanguageVariantsUnusedLoadingContainer = '.' + PublicationPackageGuid + $(this.TemplatePublicationPackageProjectLanguageVariantsUnusedLoading).attr('data-container');
	this.UpdateArea(this.TemplatePublicationPackageProjectLanguageVariantsUnusedLoading, PublicationPackageProjectLanguageVariantsUnusedLoadingContainer, undefined);

	var ThisClass = this;
	var RqlXml = '<PROJECT><EXPORTSETTINGS action="list" guid="' + PublicationPackageGuid + '" /></PROJECT>';
	
	RqlConnectorObj.SendRql(RqlXml, false, function(data){
		var PublicationPackageProjectLanguageVariantsUnused = [];
		$(data).find('UNUSEDSETTING ').each(function(){
			var PublicationPackageProjectLanguageVariantUnused = {
				'guid': $(this).attr('guid'),
				'projectvariantguid': $(this).attr('projectvariantguid'),
				'languagevariantguid': $(this).attr('languagevariantguid'),
				'name': $(this).attr('name')
			}
			
			PublicationPackageProjectLanguageVariantsUnused.push(PublicationPackageProjectLanguageVariantUnused);
		});
		var PublicationPackageProjectLanguageVariantsUnusedContainer = '.' + PublicationPackageGuid + $(ThisClass.TemplatePublicationPackageProjectLanguageVariantsUnused).attr('data-container');
		ThisClass.UpdateArea(ThisClass.TemplatePublicationPackageProjectLanguageVariantsUnused, PublicationPackageProjectLanguageVariantsUnusedContainer, {'publicationpackageprojectlanguagevariantsunused': PublicationPackageProjectLanguageVariantsUnused});
	});
}

PublicationPackageManager.prototype.CopyProjectLanguageVariant = function(PublicationPackageGuid, NewProjectVariantGuid, NewLanguageVariantGuid, TargetProjectVariantGuid, TargetLangugageVariantGuid) {
	var ThisClass = this;	
	var RqlXml = '<PROJECT><EXPORTSETTING action="save" guid="' + PublicationPackageGuid + '" projectvariantguid="' + NewProjectVariantGuid + '" languagevariantguid="' + NewLanguageVariantGuid + '" copyguid="' + TargetProjectVariantGuid + TargetLangugageVariantGuid + '" /></PROJECT>';
	
	console.log(RqlXml);
	RqlConnectorObj.SendRql(RqlXml, false, function(data){
		ThisClass.ListPublicationPackageProjectLanguageVariantsAll(PublicationPackageGuid);
	});
}

PublicationPackageManager.prototype.ChangePublicationTargets = function() {
	var ThisClass = this;	
	var PublicationTargetObjsArray = [];
	
	var ChangePublicationTargetDialogPublicationTargetsContainer = $(this.TemplateChangePublicationTargetDialogPublicationTargets).attr('data-container');
	$(ChangePublicationTargetDialogPublicationTargetsContainer).find('input').each(function(){
		var PublicationTargetObj = {
			guid: $(this).attr('data-target-guid'),
			selected: ($(this).prop('checked')) ? 1 : 0
		}
		
		PublicationTargetObjsArray.push(PublicationTargetObj);
	});

	var PublicationPackageProjectLanguageVariantsUsedContainer = $(this.TemplatePublicationPackageProjectLanguageVariantsUsed).attr('data-container');
	$(PublicationPackageProjectLanguageVariantsUsedContainer).find('input:checked').each(function(){
		$(this).prop('disabled', true);
		$(this).closest('.project-language-variant-target').removeClass('alert-success');
	
		var PublicationPackageGuid = $(this).closest('.publication-package').attr('data-guid');
		var ProjectLanguageVariantGuid = $(this).closest('.project-language-variant-target').attr('data-guid');
		
		var RqlXml = '';
		
		RqlXml += '<PROJECT><EXPORTSETTING guid="' + ProjectLanguageVariantGuid + '">';
		RqlXml += '<EXPORTTARGETS action="save">';
		$.each(PublicationTargetObjsArray, function(){
			RqlXml += '<EXPORTTARGET guid="' + this.guid +'" selected="' + this.selected + '" />';
		});
		RqlXml += '</EXPORTTARGETS>';
		RqlXml += '</EXPORTSETTING></PROJECT>';

		RqlConnectorObj.SendRql(RqlXml, false, function(data){
			ThisClass.ListPublicationPackageProjectLanguageVariantsUsed(PublicationPackageGuid);
		});
	});
}

PublicationPackageManager.prototype.UpdateArea = function(TemplateId, ContainerSelector, Data){
	if(!ContainerSelector){
		ContainerSelector = $(TemplateId).attr('data-container');
	}

	var TemplateAction = $(TemplateId).attr('data-action');
	var Template = Handlebars.compile($(TemplateId).html());
	var TemplateData = Template(Data);

	if((TemplateAction == 'append') || (TemplateAction == 'replace'))
	{
		if (TemplateAction == 'replace') {
			$(ContainerSelector).empty();
		}

		$(ContainerSelector).append(TemplateData);
	}

	if(TemplateAction == 'prepend')
	{
		$(ContainerSelector).prepend(TemplateData);
	}

	if(TemplateAction == 'after')
	{
		$(ContainerSelector).after(TemplateData);
	}
}