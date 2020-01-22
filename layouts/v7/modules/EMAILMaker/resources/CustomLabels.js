/*********************************************************************************
 * The content of this file is subject to the PDF Maker license.
 * ("License"); You may not use this file except in compliance with the License
 * The Initial Developer of the Original Code is IT-Solutions4You s.r.o.
 * Portions created by IT-Solutions4You s.r.o. are Copyright(C) IT-Solutions4You s.r.o.
 * All Rights Reserved.
 ********************************************************************************/

Vtiger.Class('EMAILMaker_CustomLabels_Js',{

    getInstance: function(){
		return new EMAILMaker_CustomLabels_Js();
    },

},{
    duplicateCheckCache: [],
    registerSaveCustomLabel : function(form,currentTrElement) {
        var thisInstance = this;
        jQuery('#js-save-cl', form).on('click', function() {
            if(form.valid()) {
                thisInstance.saveCustomLabelDetails(form, currentTrElement);
            }
        });
    },
	editCustomLabel : function(url, currentTrElement) {
		var aDeferred = jQuery.Deferred();
		var thisInstance = this;
        app.helper.showProgress();
        app.request.get({'url' : url}).then(
            function(err,response) {
                app.helper.hideProgress();
                if(err === null){
					var callback = function() {
						var form = jQuery('#editCustomLabel');
                        thisInstance.registerSaveCustomLabel(form,currentTrElement);

					};
                    var data = {};
                    data['cb'] = callback;
                    app.helper.hideProgress();
                    app.helper.showModal(response,data);
                }
			}
		);
		return aDeferred.promise();
	},
    deleteCustomLabel : function(url, currentTrElement) {
        var message = app.vtranslate('LBL_DELETE_CONFIRMATION');
        app.helper.showConfirmationBox({'message': message}).then(function () {
			app.helper.showProgress();
			alert(url);
			app.request.get({'url' : url}).then(
				function(err) {
				    alert(err);
					app.helper.hideProgress();
					if(err === null){
                        currentTrElement.hide();
                        app.helper.showSuccessNotification({"message": ''});
					}
				}
			);
        });
    },
    registerSaveCustomLabelValues : function(container, form) {
        var thisInstance = this;
        jQuery('#js-save-cl', container).on('click', function() {
            if(form.valid()) {
                thisInstance.saveCustomLabelValues(form);
            }
        });
    },
	showCustomLabelValues : function(url) {
		var thisInstance = this;
        app.helper.showProgress();
        app.request.get({'url':url}).then(
            function(err,response) {
                app.helper.hideProgress();

				if(err === null){
                    var callback = function(container) {
                        //cache should be empty when modal opened
                        var form = jQuery('#showCustomLabelValues');
                        thisInstance.registerSaveCustomLabelValues(container,form);
                    };
                    var data = {};
                    data['cb'] = callback;
                    app.helper.hideProgress();
                    app.helper.showModal(response,data);
                }
			}
		);
	},
	addCustomLabelDetails : function(details) {
		
            var container = jQuery('#CustomLabelsContainer');
            var CustomLabelTable = jQuery('.CustomLabelTable', container);
            var total_tr = jQuery('#CustomLabelTable tr').length;
            var next_chid = total_tr - 1;
 
            var trElementForCustomLabel = jQuery('<tr class="opacity"><td><label class="CustomLabelKey textOverflowEllipsis">'+details.lblkey+'</label></td><td><label class="CustomLabelValue textOverflowEllipsis">'+details.lblval+'</label></td><td style="border-left: none;"><div class="pull-right actions"> <a class="editCustomLabel cursorPointer" data-url="?module=EMAILMaker&view=IndexAjax&mode=editCustomLabel&labelid='+details.labelid+'&langid='+details.langid+'"><i title="Edit" class="icon-pencil alignBottom"></i></a>&nbsp;</div></td><td ><a class="showCustomLabelValues textOverflowEllipsis cursorPointer" data-url="?module=EMAILMaker&view=IndexAjax&mode=showCustomLabelValues&labelid='+details.labelid+'&langid='+details.langid+'" id="other_langs_'+details.labelid+'">'+app.vtranslate('LBL_OTHER_VALS','EMAILMaker')+'</a></td>');

            CustomLabelTable.append(trElementForCustomLabel);
            $('#noItemFountTr').remove();
	},
	updateCustomLabelDetails : function(data, currentTrElement) {
		currentTrElement.find('.CustomLabelValue').text(data['lblval']);
	},
	saveCustomLabelValues : function(form) {
		var params = form.serializeFormData();
		if(typeof params == 'undefined' ) {
			params = {};
		}

		app.hideModalWindow();
		app.helper.showProgress();

		params.module = app.getModuleName();
		params.action = 'IndexAjax';
		params.mode = 'SaveCustomLabelValues';

		app.request.post({'data' : params}).then(
			function(err) {
				app.helper.hideProgress();
				if(err === null){
					app.helper.showSuccessNotification({"message":app.vtranslate('JS_CUSTOM_LABEL_VALUES_SAVED_SUCCESSFULLY')});
				}
			}
		);
	},
    saveCustomLabelDetails : function(form, currentTrElement) {
        var aDeferred = jQuery.Deferred();
        var thisInstance = this;
        var params = form.serializeFormData();

        if(typeof params == 'undefined' ) {
            params = {};
        }

        var editViewForm = jQuery('#editCustomLabel');
        this.formValidatorInstance = editViewForm.vtValidate({
            submitHandler : function() {
                thisInstance.checkDuplicateKey(params).then(
                    	function(result) {
                            if (result.success) {
                                app.helper.showErrorNotification({"message":result.message});
                            } else {
                                app.helper.showProgress();

                                params.module = app.getModuleName();
                                params.action = 'IndexAjax';
                                params.mode = 'SaveCustomLabel';
                                app.request.post({'data' : params}).then(
                                    function(err,response) {
                                        app.helper.hideProgress();
                                        app.helper.hideModal();
                                        if(err === null){
											if(form.find('.addCustomLabelView').val() == "true") {
												thisInstance.addCustomLabelDetails(response);
											} else {
												thisInstance.updateCustomLabelDetails(response, currentTrElement);
											}
                                            app.helper.showSuccessNotification({"message":app.vtranslate('JS_CUSTOM_LABEL_SAVED_SUCCESSFULLY')});

                                        }
                                    }
                                );
                            }
                        }
                );
            }
        });
        return aDeferred.promise();
    },
    checkDuplicateKey : function(details) {
		var aDeferred = jQuery.Deferred();
		var LblKey = details.LblKey;

		var params = {
			'module' : 'EMAILMaker',
			'action' : 'IndexAjax',
			'mode' : 'checkDuplicateKey',
			'lblkey' : LblKey
		};
        app.request.get({'data' : params}).then(
            function(err,response) {
            	if (err === null) {
                    aDeferred.resolve(response);
                }
			}
		);
		return aDeferred.promise();
	},
	registerActions : function() {
        var thisInstance = this;
		var container = jQuery('#CustomLabelsContainer');
		
		container.find('.addCustomLabel').click(function(e) {
			var addTaxButton = jQuery(e.currentTarget);
			var createTaxUrl = addTaxButton.data('url')+'&type='+addTaxButton.data('type');
			thisInstance.editCustomLabel(createTaxUrl);
		});
		container.on('click', '.editCustomLabel', function(e) {
			var editTaxButton = jQuery(e.currentTarget);
			var currentTrElement = editTaxButton.closest('tr');
			thisInstance.editCustomLabel(editTaxButton.data('url'), currentTrElement);
		});
        container.on('click', '.deleteCustomLabel', function(e) {
            var deleteButton = jQuery(e.currentTarget);
            var currentTrElement = deleteButton.closest('tr');
            thisInstance.deleteCustomLabel(deleteButton.data('url'), currentTrElement);
        });
		container.on('click', '.showCustomLabelValues', function(e) {
			var editTaxButton = jQuery(e.currentTarget);
			thisInstance.showCustomLabelValues(editTaxButton.data('url'));
		});
	},
	registerEvents: function() {
		this.registerActions();
	}
});