/**
 * Created by nan on 2018/1/10.
 */
Ext.Loader.syncRequire(['Ext.ux.form.field.MultiCombo', 'Ext.ux.grid.column.ArrayColumn']);
Ext.syncRequire(['CGP.role.store.Role', 'Ext.ux.form.field.MultiCombo']);
Ext.syncRequire(['CGP.product.model']);
Ext.ClassManager.setAlias('Ext.selection.CheckboxModel', 'selection.checkboxmodel');
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller', {
    showProductDetaile: function (value) {
        var items = [];
        for (var count = 0; count < value.length; count++) {
            var conditions = value[count];
            var countItems = [];
            var headersItems = [];
            var queryParametersItems = [];
            for (var i in conditions) {
                if (i == 'clazz') {
                    conditions[i] = conditions[i].substring(conditions[i].lastIndexOf('.') + 1, (conditions[i].length));
                    continue;
                }
                var item = {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey(i),
                    value: conditions[i]
                };
                countItems.push(item)
            }
            items.push({
                xtype: 'fieldset',
                labelAlign: 'top',
                title: i18n.getKey('product') + (count + 1),
                fieldLabel: i18n.getKey('product') + (count + 1),
                defaults: {
                    margin: '0 0 10 30'
                },
                collapsible: true,
                items: countItems
            })
        }
        var form = Ext.create('Ext.form.Panel', {
            defaults: {
                margin: 10
            },
            autoScroll: true,
            border: false,
            items: items
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('product') + i18n.getKey('config'),
            height: 600,
            width: 600,
            layout: 'fit',
            items: form
        }).show();
    },
    editOrcreatePartnerReportSummaryConfigItem: function (view, createOrEdit, record, partnerId) {
        if (createOrEdit == 'create') {
            record = Ext.create(view.store.model);
        }
        var EnableProductStore = Ext.create('CGP.partner.store.EnableProductStore', {
            partnerId: partnerId
        });
        var items = [
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                itemId: 'productId',
                name: 'productId',
                displayField: 'id',
                multiSelect: true,
                editable: false,
                valueField: 'id',
                labelAlign: 'left',
                store: EnableProductStore,
                gridCfg: {
                    store: EnableProductStore,
                    hideHeaders: true,
                    multiSelect: true,
                    selType: 'checkboxmodel',
                    height: 250,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 300,
                            dataIndex: 'id',
                            renderer: function () {
                                return arguments[2].data.id + '(' + arguments[2].data.name + ')'
                            }
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: EnableProductStore,
                            dock: 'bottom',
                            displayInfo: false
                        }
                    ]
                },
                listeners: {
                    'render': function (view) {
                        EnableProductStore.load({callback: function () {
                            view.setSubmitValue(record.get('productId'))
                        }});
                    }
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('displayName'),
                itemId: 'displayName',
                name: 'displayName',
                value: record.get('displayName')
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('price'),
                itemId: 'price',
                name: 'price',
                value: Ext.isEmpty(record.get('price')) ? null : record.get('price')
            }
        ];
        var alterWin = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit),
            height: 300,
            width: 600,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                defaults: {
                    margin: '10 0 10 50',
                    allowBlank: false,
                    width: 450
                },
                items: items,
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_save',
                        handler: function () {
                            if (this.ownerCt.ownerCt.isValid()) {
                                for (var i = 0; i < this.ownerCt.ownerCt.items.items.length; i++) {
                                    if (this.ownerCt.ownerCt.items.items[i].xtype == 'gridcombo') {
                                        record.set(this.ownerCt.ownerCt.items.items[i].getName(), this.ownerCt.ownerCt.items.items[i].getSubmitValue());

                                    } else {
                                        record.set(this.ownerCt.ownerCt.items.items[i].getName(), this.ownerCt.ownerCt.items.items[i].getValue());
                                    }
                                }
                                if (createOrEdit == 'create') {
                                    view.store.add(record);
                                }
                                alterWin.close();
                            }

                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_cancel',
                        text: i18n.getKey('cancel'),
                        handler: function () {
                            alterWin.close();
                        }
                    }
                ]

            }
        });
        alterWin.show();

    },
    getBaseFormValue: function (form) {
        var returnValue = {};
        returnValue = form.getValues();
        returnValue.titlePositions = {};
        for (var i in returnValue) {
            if (Ext.Array.contains(['endRow', 'endCol', 'startCol', 'startRow'], i)) {
                returnValue.titlePositions[i] = returnValue[i];
                delete  returnValue[i];
                returnValue.titlePositions.clazz = 'com.qpp.cgp.domain.partner.report.settle.config.PositionConfig';
            }
        }
        returnValue.clazz = 'com.qpp.cgp.domain.partner.report.settle.config.PartnerOrderReportConfig';
        return returnValue;

    },
    getEmailTemplateConfigFormValue: function (form) {
        var returnValue = {};
        returnValue.mailTemplateConfig = {};
        for (var i = 0; i < form.items.items.length; i++) {
            var item = form.items.items[i];
            if (item.xtype != 'form') {
                if (Ext.Array.contains(['to', 'cc', 'bcc'], item.getName())) {
                    if (!Ext.isEmpty(item.getSubmitValue())) {
                        var arrayValue = item.getSubmitValue().split(',');
                        var emailArray = [];
                        var roleIdsArray = [];
                        var result = [];
                        for (var j = 0; j < arrayValue.length; j++) {
                            var resultStr = arrayValue[j].substring(15, arrayValue[j].length);
                            if (resultStr.indexOf('角色编号') == -1) {
                                emailArray.push(resultStr);
                            } else {
                                var resultStr = arrayValue[j].substring(arrayValue[j].indexOf('角色编号：') + 5, arrayValue[j].length - 1)
                                roleIdsArray.push(parseInt(resultStr));
                            }
                        }
                        if (!Ext.isEmpty(emailArray)) {
                            result.push({
                                clazz: 'com.qpp.cgp.domain.mail.ListStringMailReceiver',
                                emails: emailArray
                            });
                        }
                        if (!Ext.isEmpty(roleIdsArray)) {
                            result.push({
                                clazz: 'com.qpp.cgp.domain.mail.RoleMailReceiver',
                                roleIds: roleIdsArray
                            });
                        }
                        if (result.length > 0) {
                            returnValue.mailTemplateConfig[item.getName()] = result;
                        }
                    }
                }
                else if (item.getName() == 'subject') {
                    returnValue.mailTemplateConfig[item.getName()] = item.items.items[0].getValue();
                } else {
                    returnValue.mailTemplateConfig[item.getName()] = item.getValue();
                }
            } else {
                if (item.name == 'attachments') {
                    function getSubmitValue() {
                        var value = [];
                        var fieldArray = item.items.items;
                        for (var i = 0; i < fieldArray.length; i++) {
                            var field = fieldArray[i];
                            var name = field.name;
                            var fileName = field.fileName;
                            var uploadId = field.uploadId;
                            value.push({
                                    clazz: 'com.qpp.cgp.domain.dto.mail.MailAttachment',
                                    name: fileName,
                                    url: imageServer + name
                                }
                            );
                        }
                        return value;
                    }

                    returnValue.mailTemplateConfig[item.name] = getSubmitValue();
                }
            }
        }
        return returnValue;
    },
    getReportConfigFormValue: function (form) {
        var returnValue = {};
        for (var i = 0; i < form.items.items.length; i++) {
            var item = form.items.items[i];
            if (item.xtype == 'gridfield') {
                returnValue[item.getName()] = item.getSubmitValue();
            } else {
                returnValue[item.getName()] = item.getValue();
            }
        }
        for (var i in returnValue) {
            if (i == 'partnerReportSummaryConfig' || i == 'partnerReportDetailsConfig') {
                var displayNames = [];
                for (var j = 0; j < returnValue[i].displayNames.length; j++) {
                    displayNames.push(returnValue[i].displayNames[j]['displayName']);
                }
                returnValue[i].displayNames = displayNames;
            }
            if (i == 'productConfigs') {
                for (var j = 0; j < returnValue['productConfigs'].length; j++) {
                    var str = returnValue['productConfigs'][j].productId;
                    if (!(str instanceof Array)) {
                        var productId2 = [];
                        var array1 = str.split(',');
                        for (var k = 0; k < array1.length; k++) {
                            productId2.push(parseInt(array1[k]));
                        }
                        returnValue[i][j].productId = productId2;
                    }
                }
            }
        }
        return returnValue;
    },
    getAllFormValue: function (form) {
        var tab = form.ownerCt;
        var baseInfoForm = form.ownerCt.items.items[0];
        var emailTemplateConfigForm = form.ownerCt.items.items[1];
        var reportConfigForm = form.ownerCt.items.items[2];
        if (baseInfoForm.isValid() && emailTemplateConfigForm.isValid() && reportConfigForm.isValid()) {
            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
            var allFormValue = {};
            var baseInfoFormValue = controller.getBaseFormValue(baseInfoForm);
            var emailTemplateConfigFormValue = controller.getEmailTemplateConfigFormValue(emailTemplateConfigForm);
            var reportConfigFormValue = controller.getReportConfigFormValue(reportConfigForm);
            allFormValue = Ext.Object.merge({}, baseInfoFormValue, emailTemplateConfigFormValue, reportConfigFormValue);
            return allFormValue;

        }
    },
    saveFormValue: function (partnerId, data, createOrEdit, tab) {
        var parentWindowTab = top.Ext.getCmp("tabs");
        var editTab = parentWindowTab.getComponent('partnerOrderReportConfigManageEdit');
        var manageTab = parentWindowTab.getComponent('partnerOrderReportConfigManage');
        if (createOrEdit == 'create') {
            Ext.Ajax.request({
                url: adminPath + 'api/partners/' + partnerId + '/reports/configs',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: data,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                            parentWindowTab.setActiveTab(manageTab);
                            manageTab
                            editTab.close();
                        });

                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        } else {
            Ext.Ajax.request({
                url: adminPath + 'api/partners/' + partnerId + '/reports/configs/' + data._id,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: data,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                            parentWindowTab.setActiveTab(manageTab);
                            editTab.close();
                        });
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })
        }
    },
    setReportConfigFormValue: function (form, value) {
        if (!Ext.isEmpty(value.get('clazz'))) {
            var productConfigs = form.getComponent('productConfigs');
            var partnerReportDetailsConfig = form.getComponent('partnerReportDetailsConfig');
            var partnerReportSummaryConfig = form.getComponent('partnerReportSummaryConfig');
            var partnerReportOrderListConfig = form.getComponent('partnerReportOrderListConfig');
            productConfigs.setSubmitValue(value.get('productConfigs'));
            //partnerReportSummaryConfig
            partnerReportSummaryConfig.getComponent('dateFormat').setValue(value.get('partnerReportDetailsConfig').dateFormat)
            var configArray = [];
            if (!Ext.isEmpty(value.get('partnerReportSummaryConfig').displayNames)) {
                for (var i = 0; i < value.get('partnerReportSummaryConfig').displayNames.length; i++) {
                    configArray.push({
                        displayName: value.get('partnerReportSummaryConfig').displayNames[i]
                    })
                }
            }
            partnerReportSummaryConfig.getComponent('displayNames').setSubmitValue(configArray);
            partnerReportSummaryConfig.getComponent('priceFormat').setValue(value.get('partnerReportSummaryConfig').priceFormat)
            //partnerReportDetailsConfig
            partnerReportDetailsConfig.getComponent('dateFormat').setValue(value.get('partnerReportDetailsConfig').dateFormat)
            var configArray = [];
            if (!Ext.isEmpty(value.get('partnerReportDetailsConfig').displayNames)) {
                for (var i = 0; i < value.get('partnerReportDetailsConfig').displayNames.length; i++) {
                    configArray.push({
                        displayName: value.get('partnerReportDetailsConfig').displayNames[i]
                    })
                }
            }
            partnerReportDetailsConfig.getComponent('displayNames').setSubmitValue(configArray);
            //partnerReportOrderListConfig
            partnerReportOrderListConfig.getComponent('priceFormat').setValue(value.get('partnerReportOrderListConfig').priceFormat);
            partnerReportOrderListConfig.getComponent('dateFormat').setValue(value.get('partnerReportOrderListConfig').dateFormat);
            partnerReportOrderListConfig.getComponent('sheetName').setValue(value.get('partnerReportOrderListConfig').sheetName);
            partnerReportOrderListConfig.getComponent('sheetIndex').setValue(value.get('partnerReportOrderListConfig').sheetIndex);
        }
    },
    showPartnerReportDetailsConfig: function (value) {
        var displayNames = '';
        if (!Ext.isEmpty(value.displayNames)) {
            for (var i = 0; i < value.displayNames.length; i++) {
                displayNames += value.displayNames[i] + '\n';
            }
        }
        var items = [
            {
                name: 'dateFormat ',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('dateFormat'),
                itemId: 'dateFormat ',
                value: value.dateFormat

            },

            {
                name: 'displayNames ',
                xtype: 'textarea',
                readOnly: true,
                height: 200,
                width: 550,
                fieldLabel: i18n.getKey('displayNames'),
                itemId: 'displayNames ',
                value: displayNames

            }
        ];
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            border: false,
            items: items,
            defaults: {
                padding: 10
            }
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('report') + i18n.getKey('detail') + i18n.getKey('config'),
            height: 400,
            width: 600,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
    showPartnerReportSummaryConfig: function (value) {
        var displayNames = '';
        if (!Ext.isEmpty(value.displayNames)) {
            for (var i = 0; i < value.displayNames.length; i++) {
                displayNames += value.displayNames[i] + '\n';
            }
        }
        var items = [
            {
                name: 'dateFormat ',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('dateFormat'),
                itemId: 'dateFormat ',
                value: value.dateFormat

            },
            {
                name: 'priceFormat ',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('priceFormat'),
                itemId: 'priceFormat ',
                value: value.priceFormat

            },
            {
                name: 'displayNames ',
                xtype: 'textarea',
                readOnly: true,
                height: 200,
                width: 550,
                fieldLabel: i18n.getKey('displayNames'),
                itemId: 'displayNames ',
                value: displayNames

            }
        ];
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            border: false,
            items: items,
            defaults: {
                padding: 10
            }
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('report') + i18n.getKey('summary') + i18n.getKey('config'),
            height: 400,
            width: 600,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
    showTitlePositions: function (value) {
        var items = [
            {
                name: 'startRow',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('startRow'),
                itemId: 'startRow',
                value: value.startRow

            },
            {
                name: 'startCol',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('startCol'),
                itemId: 'startCol',
                value: value.startCol

            },
            {
                name: 'endRow',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('endRow'),
                itemId: 'endRow',
                value: value.endRow

            },
            {
                name: 'endCol',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('endCol'),
                itemId: 'endCol',
                value: value.endCol

            }
        ];
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            border: false,
            items: items,
            defaults: {
                padding: 20,
                labelWidth: 150
            }
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('titlePositions'),
            height: 300,
            modal: true,
            width: 300,
            layout: 'fit',
            items: form
        }).show();
    },
    showMailTemplateConfigDetail: function (value) {
        var resultStr2 = '';
        for (var i = 0; i < value.attachments.length; i++) {
            resultStr2 += (value.attachments[i].name) + '\n';
        }
        var roleStore = Ext.create("CGP.role.store.Role", {
                listeners: {
                    load: function (DBStorestore, records) {
                        for (var i = 0; i < records.length; i++) {
                            records[i].set('show', records[i].get('name') + "(角色编号：" + records[i].get('id') + ")");
                        }
                    }
                }
            }
        );
        var to = {};
        for (var i = 0; i < value.to.length; i++) {
            if (!Ext.isEmpty(value.to[i]['emails'])) {
                to['emails'] = value.to[i]['emails'];
            }
            if (!Ext.isEmpty(value.to[i]['roleIds'])) {
                to['roleIds'] = value.to[i]['roleIds'];

            }
        }
        var cc = {};
        if (!Ext.isEmpty(value.cc)) {
            for (var i = 0; i < value.cc.length; i++) {
                if (!Ext.isEmpty(value.cc[i]['emails'])) {
                    cc['emails'] = value.cc[i]['emails'];
                }
                if (!Ext.isEmpty(value.cc[i]['roleIds'])) {
                    cc['roleIds'] = value.cc[i]['roleIds'];

                }
            }

        }
        var bcc = {};
        if (!Ext.isEmpty(value.bcc)) {
            for (var i = 0; i < value.bcc.length; i++) {
                if (!Ext.isEmpty(value.bcc[i]['emails'])) {
                    bcc['emails'] = value.bcc[i]['emails'];
                }
                if (!Ext.isEmpty(value.bcc[i]['roleIds'])) {
                    bcc['roleIds'] = value.bcc[i]['roleIds'];

                }
            }
        }
        var fun = function (store, data) {
            var rolesId = Ext.isEmpty(data.roleIds) ? null : data.roleIds
            var resultArray = [];
            if (rolesId) {
                for (var i = 0; i < rolesId.length; i++) {
                    var record = store.findRecord('id', rolesId[i])
                    resultArray.push(record.get('show'));
                }
            }
            return resultArray;
        };
        roleStore.load(function () {
            var items = [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    readOnly: true,
                    width: 550,
                    value: value.clazz

                },
                {
                    name: 'subject',
                    xtype: 'textfield',
                    readOnly: true,
                    width: 550,
                    fieldLabel: i18n.getKey('subject'),
                    itemId: 'subject',
                    value: value.subject

                },
                {
                    name: 'content',
                    xtype: 'textarea',
                    readOnly: true,
                    height: 200,
                    width: 550,
                    fieldLabel: i18n.getKey('content'),
                    itemId: 'content',
                    value: value.content

                },
                {
                    name: 'attachments',
                    xtype: 'textarea',
                    readOnly: true,
                    height: 150,
                    width: 550,
                    fieldLabel: i18n.getKey('attachments'),
                    itemId: 'attachmentsList',
                    value: resultStr2
                },
                {
                    name: 'to',
                    xtype: 'uxfieldcontainer',
                    readOnly: true,
                    fieldLabel: i18n.getKey('receiverName'),
                    itemId: 'to',
                    items: [
                        {
                            xtype: 'textarea',
                            width: 500,
                            readOnly: true,
                            fieldLabel: i18n.getKey('email'),
                            value: Ext.isEmpty(to.emails) ? null : to['emails']
                        },
                        {
                            xtype: 'textfield',
                            width: 500,
                            readOnly: true,
                            fieldLabel: i18n.getKey('role'),
                            value: fun(roleStore, to)

                        }
                    ]
                },
                {
                    name: 'cc',
                    xtype: 'uxfieldcontainer',
                    readOnly: true,
                    fieldLabel: i18n.getKey('copySend'),
                    itemId: 'cc',
                    hidden: Ext.isEmpty(value.cc),
                    items: [
                        {
                            xtype: 'textarea',
                            width: 500,
                            readOnly: true,
                            fieldLabel: i18n.getKey('email'),
                            value: Ext.isEmpty(cc.emails) ? null : cc['emails']

                        },
                        {
                            xtype: 'textfield',
                            width: 500,
                            readOnly: true,
                            fieldLabel: i18n.getKey('role'),
                            value: fun(roleStore, cc)
                        }
                    ]
                },
                {
                    name: 'bcc',
                    xtype: 'uxfieldcontainer',
                    readOnly: true,
                    fieldLabel: i18n.getKey('blindCopySend'),
                    itemId: 'bcc',
                    hidden: Ext.isEmpty(value.bcc),
                    items: [
                        {
                            xtype: 'textarea',
                            width: 500,
                            readOnly: true,
                            fieldLabel: i18n.getKey('email'),
                            value: Ext.isEmpty(bcc.emails) ? null : bcc['emails']

                        },
                        {
                            xtype: 'textfield',
                            width: 500,
                            readOnly: true,
                            fieldLabel: i18n.getKey('role'),
                            value: fun(roleStore, bcc)
                        }
                    ]
                }

            ];
            var form = Ext.create('Ext.form.Panel', {
                autoScroll: true,
                border: false,
                items: items,
                defaults: {
                    padding: 20
                }
            });
            Ext.create('Ext.window.Window', {
                title: i18n.getKey('mail') + i18n.getKey('template') + i18n.getKey('config'),
                height: 600,
                width: 700,
                modal: true,
                layout: 'fit',
                items: form
            }).show();
        });


    },
    changeReportTemplateFilePath: function (displayField) {
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('notifyEmailConfig'),
            height: 150,
            width: 600,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                itemId: 'fileUpload',
                border: false,
                width: 600,
                height: '100%',
                bbar: ['->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_agree',
                        id: 'changeReportTemplateFilePathBar',
                        itemId: 'changeReportTemplateFilePathBar',
                        amount: 0,
                        handler: function (button) {
                            var formPanel = this.ownerCt.ownerCt.ownerCt.getComponent('fileUpload');
                            var file = formPanel.getComponent('file');
                            if (!Ext.isEmpty(file.getRawValue())) {
                                var myMask = new Ext.LoadMask(this.ownerCt.ownerCt.ownerCt, {msg: "上传中..."});
                                myMask.show();
                                formPanel.getForm().submit({
                                    url: adminPath + 'api/files?access_token=' + Ext.util.Cookies.get('token'),
                                    method: 'POST',
                                    success: function (form, action) {
                                        myMask.hide();
                                        displayField.setValue(imageServer + action.response.data[0].name);
                                        formPanel.ownerCt.close();
                                    },
                                    failure: function (form, action) {
                                        myMask.hide();
                                    }
                                });
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_cancel',
                        text: i18n.getKey('cancel'),
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ],
                items: [
                    {
                        name: 'files',
                        xtype: 'filefield',
                        width: 530,
                        padding: 20,
                        allowBlank: true,
                        enableKeyEvents: true,
                        buttonText: i18n.getKey('choice'),
                        fieldLabel: i18n.getKey('attachments'),
                        itemId: 'file'
                    }
                ]
            }
        }).show();
    },
    showAllEnablePlaceholder: function () {
        var localData = {
            "partnerName": null,
            "year": 0,
            "month": 0,
            "totalCount": 0,
            "totalPrice": 0.0,
            "context": {
                "yearMonth": null,
                "productSummaries": [
                    {
                        "productId": [
                            {

                            }
                        ],
                        "displayName": null,
                        "price": null,
                        "qty": 0,
                        "totalPrice": null
                    }
                ],
                "reportDetail": {
                    "dayDetails": [
                        {
                            "oneDayDetail": {
                                "dateFormatString": null,
                                "productOneDayDetails": [
                                    {
                                        "productId": [
                                            {

                                            }
                                        ],
                                        "qty": null
                                    }
                                ],
                                "totalQty": null
                            }
                        }
                    ],
                    "reportDetailHeaders": [
                        {

                        }
                    ]
                }
            }
        };
        var valueString = JSON.stringify(localData, null, "\t");
        var win = Ext.create("Ext.window.Window", {
            id: "layers",
            layout: 'fit',
            title: i18n.getKey('可用的占位符'),
            items: [
                {
                    xtype: 'textarea',
                    fieldLabel: false,
                    width: 600,
                    height: 400,
                    value: valueString
                }
            ]
        });
        win.show();
    },
    addEmailOrRoleIds: function (diyemailsfieldcomponent) {
        var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
        var roleStore = Ext.create("CGP.role.store.Role", {
            listeners: {
                load: function (DBStorestore, records) {
                    for (var i = 0; i < records.length; i++) {
                        records[i].set('show', records[i].get('name') + "(角色编号：" + records[i].get('id') + ")");
                    }
                }
            }
        });
        var items = [
            {
                xtype: 'combo',
                itemId: 'selectType',
                name: 'selectType',
                margin: 10,
                width: 300,
                allowBlank: false,
                editable: false,
                fieldLabel: i18n.getKey('selectType'),
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'type', type: 'string'}
                    ],
                    data: [
                        {type: 'email'},
                        {type: 'roleId'}
                    ]
                }),
                displayField: 'type',
                valueField: 'type',
                value: 'email',
                listeners: {
                    'change': function (view, NewValue, oldValue) {
                        var enterEmail = this.ownerCt.getComponent('enterEmail');
                        var roleIds = this.ownerCt.getComponent('roleIds');
                        if (NewValue == 'email') {
                            roleIds.setDisabled(true);
                            roleIds.hide();
                            enterEmail.setDisabled(false);
                            enterEmail.show();
                        } else {
                            roleIds.setDisabled(false);
                            roleIds.show();
                            enterEmail.setDisabled(true);
                            enterEmail.hide();
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                width: 300,
                itemId: 'enterEmail',
                margin: 10,
                allowBlank: false,
                labelAlign: 'lift',
                msgTarget: 'side',
                fieldLabel: i18n.getKey('email'),
                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                regexText: i18n.getKey('Please enter the correct email!')
            },
            {
                xtype: 'multicombobox',
                itemId: 'roleIds',
                name: 'roleIds',
                store: roleStore,
                width: 300,
                hidden: true,
                disabled: true,
                margin: 10,
                allowBlank: true,
                displayField: 'name',
                valueField: 'show',
                editable: false,
                multiSelect: true,
                fieldLabel: i18n.getKey('role')
            }
        ]
        var win = Ext.create("Ext.window.Window", {
            title: i18n.getKey('selectType'),
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    fieldLabel: false,
                    width: 400,
                    height: 200,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: items,
                    bbar: [
                        '->',
                        {
                            xtype: 'button',
                            text: i18n.getKey('add'),
                            iconCls: 'icon_agree',
                            handler: function () {
                                if (this.ownerCt.ownerCt.isValid()) {
                                    var repeatValue = [];
                                    var type = this.ownerCt.ownerCt.getComponent('selectType').getValue();
                                    var dataArray = (diyemailsfieldcomponent.getSubmitValue()).split(',');
                                    if (type == 'email') {
                                        var enterEmail = this.ownerCt.ownerCt.getComponent('enterEmail').getValue();
                                        if (!Ext.Array.contains(dataArray, '&nbsp&nbsp&nbsp' + enterEmail)) {
                                            diyemailsfieldcomponent.setSingleValue(enterEmail);
                                        } else {
                                            repeatValue.push(enterEmail)
                                        }
                                        if (!Ext.isEmpty(repeatValue)) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), '邮箱：' + repeatValue + '已存在,请不要重复添加')
                                        }
                                        this.ownerCt.ownerCt.getComponent('enterEmail').reset();
                                    } else {
                                        var roleIds = this.ownerCt.ownerCt.getComponent('roleIds').getValue();
                                        for (var i = 0; i < roleIds.length; i++) {
                                            if (!Ext.Array.contains(dataArray, '&nbsp&nbsp&nbsp' + roleIds[i])) {
                                                diyemailsfieldcomponent.setSingleValue(roleIds[i]);
                                            } else {
                                                repeatValue.push(roleIds[i]);
                                            }
                                            if (!Ext.isEmpty(repeatValue)) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), '角色：' + repeatValue + '已存在,请不要重复添加')
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon_cancel',
                            text: i18n.getKey('cancel'),
                            handler: function () {
                                win.close();
                            }
                        }
                    ]
                }
            ]

        });
        win.show();
    },
    setDiyEmailFieldComponentValue: function (view, arrayData) {
        var toData = arrayData.get('mailTemplateConfig').to;
        var ccData = arrayData.get('mailTemplateConfig').cc;
        var bccData = arrayData.get('mailTemplateConfig').bcc;
        var to = view.getComponent('to');
        var cc = view.getComponent('cc');
        var bcc = view.getComponent('bcc');
        to.reset();
        cc.reset();
        bcc.reset();
        var roleStore = Ext.create("CGP.role.store.Role", {
                listeners: {
                    load: function (DBStorestore, records) {
                        for (var i = 0; i < records.length; i++) {
                            records[i].set('show', records[i].get('name') + "(角色编号：" + records[i].get('id') + ")");
                        }
                    }
                }
            }
        );
        roleStore.load(function () {
            if (!Ext.isEmpty(toData)) {
                for (var i = 0; i < toData.length; i++) {
                    if (!Ext.isEmpty(toData[i].emails)) {
                        for (var j = 0; j < toData[i].emails.length; j++) {
                            to.setSingleValue(toData[i].emails[j]);


                        }
                    }
                    if (!Ext.isEmpty(toData[i].roleIds)) {
                        var localData = toData[i].roleIds;
                        for (var j = 0; j < localData.length; j++) {
                            var record = roleStore.findRecord('id', localData[j])
                            to.setSingleValue(record.get('show'));
                        }
                    }
                }
            }
            if (!Ext.isEmpty(ccData)) {
                for (var i = 0; i < ccData.length; i++) {
                    if (!Ext.isEmpty(ccData[i].emails)) {
                        for (var j = 0; j < ccData[i].emails.length; j++) {
                            cc.setSingleValue(ccData[i].emails[j]);


                        }
                    }
                    if (!Ext.isEmpty(ccData[i].roleIds)) {
                        var localData = ccData[i].roleIds;
                        for (var j = 0; j < localData.length; j++) {
                            var record = roleStore.findRecord('id', localData[j])
                            cc.setSingleValue(record.get('show'));
                        }
                    }
                }
            }
            if (!Ext.isEmpty(bccData)) {
                for (var i = 0; i < bccData.length; i++) {
                    if (!Ext.isEmpty(bccData[i].emails)) {
                        for (var j = 0; j < bccData[i].emails.length; j++) {
                            bcc.setSingleValue(bccData[i].emails[j]);


                        }
                    }
                    if (!Ext.isEmpty(bccData[i].roleIds)) {
                        var localData = bccData[i].roleIds;
                        for (var j = 0; j < localData.length; j++) {
                            var record = roleStore.findRecord('id', localData[j])
                            bcc.setSingleValue(record.get('show'));
                        }
                    }
                }
            }
        })
    }
})

