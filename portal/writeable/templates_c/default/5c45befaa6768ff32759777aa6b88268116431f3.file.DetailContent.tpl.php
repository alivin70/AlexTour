<?php /* Smarty version Smarty-3.1.19, created on 2019-11-18 06:47:25
         compiled from "/var/www/html/crm.avelacom/portal/layouts/default/templates/Portal/partials/DetailContent.tpl" */ ?>
<?php /*%%SmartyHeaderCode:11484639945dd23e7d191f74-69647081%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '5c45befaa6768ff32759777aa6b88268116431f3' => 
    array (
      0 => '/var/www/html/crm.avelacom/portal/layouts/default/templates/Portal/partials/DetailContent.tpl',
      1 => 1570520845,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '11484639945dd23e7d191f74-69647081',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.19',
  'unifunc' => 'content_5dd23e7d194152_01115847',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5dd23e7d194152_01115847')) {function content_5dd23e7d194152_01115847($_smarty_tpl) {?>


    <div ng-class="{'col-lg-5 col-md-5 col-sm-12 col-xs-12 leftEditContent':splitContentView, 'col-lg-12 col-md-12 col-sm-12 col-xs-12 leftEditContent nosplit':!splitContentView}">
        <div class="container-fluid">
            <div class="row">
                <div class="row detailRow" ng-hide="fieldname=='id' || fieldname=='identifierName' || fieldname=='{{header}}' || fieldname=='documentExists' || fieldname=='referenceFields'"  ng-repeat="(fieldname, value) in record">
                    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <label class="fieldLabel" translate="{{fieldname}}"> {{fieldname}} </label>
                    </div>
                    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                        <!-- <span class="label label-default">{{value}}</span> -->
                        <span style="white-space: pre-line;" class="value detail-break">{{value}}</span>
                    </div>
                </div>
                <div class="row detailRow" ng-if="module == 'Documents'">
                    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <label ng-if="module=='Documents'" class="fieldLabel" translate="Attachments">Attachments</label>
                    </div>
                    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12" ng-if="documentExists">

                        <!-- SalesPlatform.ru begin -->
                        <!-- <button class="btn btn-primary" ng-click="downloadFile(module,id,parentId)" title="Download {{record[header]}}">Download</button>-->
                        <button class="btn btn-primary" ng-click="downloadFile(module,id,parentId)" translate="Download" title="Download {{record[header]}}">Download</button>
                        <!-- SalesPlatform.ru end -->

                    </div>
                </div>
            </div>
        </div>
    </div>

<?php }} ?>
