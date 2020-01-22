/*********************************************************************************
 * The content of this file is subject to the EMAIL Maker license.
 * ("License"); You may not use this file except in compliance with the License
 * The Initial Developer of the Original Code is IT-Solutions4You s.r.o.
 * Portions created by IT-Solutions4You s.r.o. are Copyright(C) IT-Solutions4You s.r.o.
 * All Rights Reserved.
 ********************************************************************************/
Vtiger.Class("EMAILMaker_License_Js", {

    licenseInstance: false,
    getInstance: function () {
        if (EMAILMaker_License_Js.licenseInstance == false) {
            var instance = new window["EMAILMaker_License_Js"]();
            EMAILMaker_License_Js.licenseInstance = instance;
            return instance;
        }
        return EMAILMaker_License_Js.licenseInstance;
    }

}, {

    editLicense : function($type) {
        var aDeferred = jQuery.Deferred();
        var thisInstance = this;

        app.helper.showProgress();

        var license_key = jQuery('#license_key_val').val();
        url = "index.php?module=EMAILMaker&view=IndexAjax&mode=editLicense&type="+$type+"&key="+license_key;

        app.request.post({'url':url}).then(
            function(err,response) {
                if(err === null){

                    app.helper.hideProgress();

                    app.helper.showModal(response, {
                        'cb' : function(modalContainer) {
                            modalContainer.find('#js-edit-license').on('click', function(){
                                var form = modalContainer.find('#editLicense');
                                if(form.valid()) {
                                    thisInstance.saveLicenseKey(form,false);
                                }
                                return false;
                            });
                        }
                    });
                }
            });
        return aDeferred.promise();
    },
    saveLicenseKey : function(form,is_install) {
        var thisInstance = this;

        if (is_install){
            var licensekey_val = jQuery('#licensekey').val();

            var params = {
                module : 'EMAILMaker',
                licensekey : licensekey_val,
                action : 'License',
                mode : 'editLicense',
                type : 'activate'
            };

        } else {
            var params = form.serializeFormData();
        }
        thisInstance.validateLicenseKey(params).then(
            function(data) {

                if (!is_install){
                    app.hideModalWindow();
                    app.helper.showSuccessNotification({"message":data.message});

                    jQuery('#license_key_val').val(data.licensekey);
                    jQuery('#license_key_label').html(data.licensekey);
                    jQuery('.license_due_date_val').html(data.due_date);

                    jQuery('#divgroup1').hide();
                    jQuery('#divgroup2').show();

                    jQuery('.license_due_date_tr').show();

                } else {
                    jQuery('#step1').hide();
                    jQuery('#step2').show();

                    jQuery('#steplabel1').removeClass("active");
                    jQuery('#steplabel2').addClass("active");
                }
            },
            function(data,err) {
            }
        );
    },


    saveCustomLabelValues : function(form) {
        var params = form.serializeFormData();
        if(typeof params == 'undefined' ) {
            params = {};
        }
        app.helper.showProgress();

        params.module = app.getModuleName();
        params.action = 'IndexAjax';
        params.mode = 'SaveCustomLabelValues';
        app.request.post({'data' : params}).then(

            function(data) {
                app.helper.hideProgress();
                app.helper.hideModal();
                app.helper.showSuccessNotification({"message":app.vtranslate(data)});
            }
        );

    },

    validateLicenseKey : function(data) {
        var thisInstance = this;
        var aDeferred = jQuery.Deferred();
        thisInstance.checkLicenseKey(data).then(
            function(data){
                aDeferred.resolve(data);
            },
            function(err){
                aDeferred.reject();
            }
        );

        return aDeferred.promise();

    },
    checkLicenseKey : function(params) {
        var aDeferred = jQuery.Deferred();
        app.helper.showProgress();
        app.request.post({'data' : params}).then(function(err,response) {
            app.helper.hideProgress();
            if(err === null){
                var result = response.success;
                if(result == true) {
                    aDeferred.resolve(response);
                } else {
                    app.helper.showErrorNotification({"message":response.message});
                    aDeferred.reject(response);
                }
            } else{
                app.helper.showErrorNotification({"message":err});
                aDeferred.reject();
            }
        });
        return aDeferred.promise();
    },
    registerActions : function() {
        var thisInstance = this;
        jQuery('#activate_license_btn').click(function() {
            thisInstance.editLicense('activate');
        });

        jQuery('#reactivate_license_btn').click(function() {
            thisInstance.editLicense('reactivate');
        });

        jQuery('#deactivate_license_btn').click(function() {
            thisInstance.deactivateLicense();
        });
    },

    deactivateLicense: function() {

        app.helper.showProgress();

        var license_key = jQuery('#license_key_val').val();
        var deactivateActionUrl = 'index.php?module=EMAILMaker&action=License&mode=deactivateLicense&key='+license_key;

        app.request.post({'url':deactivateActionUrl + '&type=control'}).then(
            function(err,response) {
                if(err === null){
                    app.helper.hideProgress();
                    if (response.success) {
                        var message = app.vtranslate('LBL_DEACTIVATE_QUESTION','EMAILMaker');
                        app.helper.showConfirmationBox({'message': message}).then(function(data) {

                            app.helper.showProgress();
                            app.request.post({'url':deactivateActionUrl}).then(
                                function(err2,response2) {
                                    if(err2 === null){
                                        if (response2.success) {
                                            app.helper.showSuccessNotification({message: response2.deactivate});

                                            jQuery('#license_key_val').val("");
                                            jQuery('#license_key_label').html("");

                                            jQuery('#divgroup1').show();
                                            jQuery('#divgroup2').hide();

                                            jQuery('.license_due_date_tr').hide();
                                        } else {
                                            app.helper.showErrorNotification({message: response2.deactivate});
                                        }
                                    } else {
                                        app.helper.showErrorNotification({"message":err2});
                                    }
                                    app.helper.hideProgress();
                                });
                        });
                    } else {
                        app.helper.showErrorNotification({message: response.deactivate});
                    }
                } else {
                    app.helper.hideProgress();
                    app.helper.showErrorNotification({"message":err});
                }
            });
    },
    registerEvents: function() {
        this.registerActions();
    },
    registerInstallEvents: function() {
        var thisInstance = this;
        this.registerInstallActions();
        var form = jQuery('#editLicense');
        form.on('submit', function(e){
            e.preventDefault();
            thisInstance.saveLicenseKey(form,true);
        });
    },
    registerInstallActions : function() {
        var thisInstance = this;
        jQuery('#next_button').click(function() {
            window.location.href = "index.php?module=EMAILMaker&view=List";
        });
    }
});