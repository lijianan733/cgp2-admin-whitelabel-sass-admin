/**
 * Created by nan on 2018/7/19.
 */
Ext.define('CGP.partner.view.supplierorderconfig.controller.Controller', {
    /**
     * 打开编辑新建restrequestConfig的panel
     * @param createOrEdit
     * @param store
     * @param tab
     * @param record
     */
    editRestHttpRequestConfig: function (createOrEdit, store, tab, record) {
        if (createOrEdit == 'create') {
            record = Ext.create('CGP.partner.view.supplierorderconfig.model.RestHttpRequestConfigModel');
        }
        var editOrCreateRestRequestConfigPanel = tab.getComponent('editOrCreateRestRequestConfigPanel');
        tab.remove(editOrCreateRestRequestConfigPanel);
        editOrCreateRestRequestConfigPanel = Ext.create('CGP.partner.view.supplierorderconfig.view.EditOrCreateRestRequestConfig', {
            title: i18n.getKey(createOrEdit) + '_' + i18n.getKey('APIRequestConfig'),
            itemId: 'editOrCreateRestRequestConfigPanel',
            store: store,
            outTab: tab,
            record: record,
            createOrEdit: createOrEdit
        });
        tab.add(editOrCreateRestRequestConfigPanel);
        tab.setActiveTab(editOrCreateRestRequestConfigPanel);

    },
    /**
     * 获取，整合httpRequestEditForm中的所有数据
     * @param form1
     * @param form2
     * @param form3
     * @param form4
     * @param form5
     * @returns {{}}
     */
    getAllFormValue: function (form0, form1, form2, form3, form4, form5) {
        var allFormValue = {};
        var form0Value = form0.getValues();
        var form1Value = form1.getValues();
        form0Value.enable = form0.getComponent('enable').getValue();
        form0Value.isTest = form0.getComponent('isTest').getValue();
        var form2Value = form2.getValues();
        var result = {};
        for (var i = 0; i < form2.items.items.length; i++) {
            result[form2Value['key' + i]] = form2Value['value' + i];
        }
        form2Value = {};
        form2Value['headers'] = result;
        result = {};
        var form3Value = form3.getValues();
        for (var i = 0; i < form3.items.items.length; i++) {
            result[form3Value['key' + i]] = form3Value['value' + i];
        }
        form3Value = {};
        form3Value['queryParameters'] = result;
        var form4Value = form4.getValues();
        var form5Value = form5.getValues();
        allFormValue = Ext.Object.merge(form0Value, form1Value, form2Value, form3Value, form4Value, form5Value);
        allFormValue['clazz'] = 'com.qpp.cgp.domain.partner.RestHttpRequestConfig';
        return allFormValue;
    },
    /**
     * 保存restRequestMailConfig
     * @param createOrEdit
     * @param record
     * @param changedValue
     * @param editConfigStore
     * @param tab
     */
    saveHttpRequestConfig: function (createOrEdit, record, changedValue, editConfigStore, tab, thisPanel) {
        var restRequestConfigPanel = tab.getComponent('restRequestConfig');
        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
            tab.setActiveTab(restRequestConfigPanel);
            if (createOrEdit == 'create') {
                for (var i in changedValue) {
                    if (i == 'type') {
                        continue;
                    }
                    record.set(i, changedValue[i]);
                }
                record.internalId = editConfigStore.data.length + 1,
                    editConfigStore.add(record);

            } else {
                for (var i in changedValue) {
                    record.set(i, changedValue[i]);
                }
            }
            thisPanel.close();

        });
    },
    /**
     * 设置server邮件配置
     * @param form
     * @param record
     */
    setServerMailConfigValue: function (form, RecordData) {
        var subject = form.getComponent('subject');
        var content = form.getComponent('content');
        var attachments = form.getComponent('attachmentsList');
        var toData = RecordData.to;
        var ccData = RecordData.cc;
        var bccData = RecordData.bcc;
        var to = form.getComponent('to');
        var cc = form.getComponent('cc');
        var bcc = form.getComponent('bcc');
        subject.items.items[0].setValue(RecordData.subject);
        content.setValue(RecordData.content);
        if (!Ext.isEmpty(RecordData['attachments'])) {
            attachments.removeAll();
            var data = RecordData['attachments'];
            if (!Ext.isEmpty(data)) {
                for (var i = 0; i < data.length; i++) {
                    var upLoadId = data[i].id;
                    var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                    var fileName = data[i].name;
                    var url = data[i].url;
                    var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var id = JSGetUUID();
                    var objDisplay = {
                        id: id,
                        width: 250,
                        name: name,
                        fileName: fileName,
                        hideLabel: true,
                        uploadId: upLoadId,
                        value: "<div id = '" + url + "' class='emailDiv'>" + fileName +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/>" +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteEmail(\"" + id + "\")'/></div>"
                    };
                    var displayField = new Ext.form.field.Display(objDisplay);
                    attachments.add(displayField);
                }
            }
        }
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
    },
    /**
     * 设置客户端邮件配置
     * @param form
     * @param record
     */
    setCustomerMailConfigValue: function (form, recordData) {
        var subject = form.getComponent('subject');
        var content = form.getComponent('content');
        var enable = form.getComponent('enable');
        var attachments = form.getComponent('attachmentsList');
        subject.items.items[0].setValue(recordData.subject);
        enable.setValue(recordData.enable);
        content.setValue(recordData.content);
        if (!Ext.isEmpty(recordData['attachments'])) {
            attachments.removeAll();
            var data = recordData['attachments'];
            if (!Ext.isEmpty(data)) {
                for (var i = 0; i < data.length; i++) {
                    var upLoadId = data[i].id;
                    var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                    var fileName = data[i].name;
                    var url = data[i].url;
                    var imgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var id = JSGetUUID();
                    var objDisplay = {
                        id: id,
                        width: 250,
                        name: name,
                        fileName: fileName,
                        hideLabel: true,
                        uploadId: upLoadId,
                        value: "<div id = '" + url + "' class='emailDiv'>" + fileName +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/>" +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteEmail(\"" + id + "\")'/></div>"
                    };
                    var displayField = new Ext.form.field.Display(objDisplay);
                    attachments.add(displayField);
                }
            }
        }
    },
    /**
     * 显示所有可用占位符
     */
    showAllEnablePlaceholder: function () {
        var win = Ext.widget('showjsondatawindow', {
            rawData: CGP.partner.view.supplierorderconfig.config.Config.data,
            title: '查看可用占位符'
        });
        win.show();
    },
    /**
     *上传图片处理
     * @constructor
     */
    UpLoadPicture: function (button) {
        var formPanel = button.ownerCt.ownerCt.getComponent('fileUpload');
        var attachmentsList = button.ownerCt.ownerCt.getComponent('attachmentsList');
        var file = formPanel.getComponent('file');
        if (!Ext.isEmpty(file.getRawValue())) {
            var myMask = new Ext.LoadMask(button.ownerCt.ownerCt, {msg: "上传中..."});
            myMask.show();
            formPanel.getForm().submit({
                url: adminPath + 'api/files?access_token=' + Ext.util.Cookies.get('token'),
                method: 'POST',
                success: function (form, action) {
                    myMask.hide();
                    var fileName = action.response.data[0].originalFileName;
                    var uploadId = action.response.data[0].id;
                    var name = action.response.data[0].name;
                    var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var id = JSGetUUID();
                    var objDisplay = {
                        id: id,
                        width: 250,
                        fileName: fileName,
                        name: name,
                        hideLabel: true,
                        uploadId: uploadId,
                        value: "<div id = '" + name + "' class='file'>" + fileName +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/>" +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteFile(\"" + id + "\")'/></div>"
                    };
                    var displayField = new Ext.form.field.Display(objDisplay);
                    attachmentsList.add(displayField);
                    file.reset();
                },
                failure: function (form, action) {
                    myMask.hide();
                }
            });
        }
    },
    /**
     * 获取用户通知邮件配置
     * @param form
     * @returns {{}}
     */
    getCustomerMailConfigValue: function (form) {
        var items = form.items.items;
        var returnValue = {};
        returnValue = {};
        for (var i = 0; i < form.items.items.length; i++) {
            var item = form.items.items[i];
            if (item.xtype != 'form') {
                if (Ext.Array.contains(['to', 'cc', 'bcc'], item.getName())) {
                }
                else if (item.getName() == 'subject') {
                    returnValue[item.getName()] = item.items.items[0].getValue();
                } else {
                    returnValue[item.getName()] = item.getValue();
                }
            } else {
                if (item.name == 'attachments') {
                    function getSubmitValue() {
                        var value = [];
                        var fieldArray = item.items.items;
                        for (var i = 0; i < fieldArray.length; i++) {
                            var field = fieldArray[i];
                            var name = field.name;
                            var uploadId = field.uploadId;
                            var fileName = field.fileName
                            value.push({
                                    clazz: 'com.qpp.cgp.domain.dto.mail.MailAttachment',
                                    name: fileName,
                                    url: imageServer + name
                                }
                            );
                        }
                        return value;
                    }

                    returnValue[item.name] = getSubmitValue();
                }
            }
        }
        returnValue.clazz = 'com.qpp.cgp.domain.mail.MailTemplateConfig';
        return returnValue;
    },
    /**
     * 获取到后台邮件配置的数据
     * @param form
     * @returns {{}}
     */
    getServerMailConfigValue: function (form, type) {
        var items = form.items.items;
        var returnValue = {};
        returnValue = {};
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
                            returnValue[item.getName()] = result;
                        }
                    }
                }
                else if (item.getName() == 'subject') {
                    returnValue[item.getName()] = item.items.items[0].getValue();
                } else {
                    returnValue[item.getName()] = item.getValue();
                }
            } else {
                if (item.name == 'attachments') {
                    function getSubmitValue() {
                        var value = [];
                        var fieldArray = item.items.items;
                        for (var i = 0; i < fieldArray.length; i++) {
                            var field = fieldArray[i];
                            var name = field.name;
                            var uploadId = field.uploadId;
                            var fileName = field.fileName
                            value.push({
                                    clazz: 'com.qpp.cgp.domain.dto.mail.MailAttachment',
                                    name: fileName,
                                    url: imageServer + name
                                }
                            );
                        }
                        return value;
                    }

                    returnValue[item.name] = getSubmitValue();
                }
            }
        }
        returnValue.clazz = 'com.qpp.cgp.domain.mail.MailTemplateConfig';
        return returnValue;
    },
    /**
     * 保存所有form中的配置
     * @param form
     * @param partnerId
     * @param createOrEdit
     * @param recordId
     */
    saveFormValue: function (form, partnerId, createOrEdit, recordId, recordData) {
        var me = this;
        var myMask = new Ext.LoadMask(form, {
            msg: "加载中..."
        });
        var restRequestConfigForm = form.outTab.getComponent('restRequestConfig');
        var notifyEmailConfigForm = form.outTab.getComponent('notifyEmailConfig');
        /*   var baseFrom = form.outTab.getComponent('baseInfoPanel');
         if (!baseFrom.isValid()) {
         form.outTab.setActiveTab(baseFrom);
         baseFrom.msgPanel.show();
         return;
         } else {
         myMask.show();
         }*/
        myMask.show();
        /*    var preStatusId = baseFrom.getComponent('preStatusId').getValue();
         var postStatusId = baseFrom.getComponent('postStatusId').getValue();
         var serviceType = baseFrom.getComponent('serviceType').getValue();
         var clazz = baseFrom.getComponent('clazz').getValue();*/
        var oldRestHttpRequestConfigs = [];
        var oldNotifyEmailConfig = [];
        if (createOrEdit == 'edit') {
            var recordData = recordData;
            for (var i = 0; i < recordData.notifyTemplates.length; i++) {
                var item = recordData.notifyTemplates[i];
                if (item.clazz == 'com.qpp.cgp.domain.partner.order.config.ApiNotifyTemplate') {
                    oldRestHttpRequestConfigs.push(item);
                }
                if (item.clazz == 'com.qpp.cgp.domain.partner.order.config.EmailNotifyTemplate') {
                    oldNotifyEmailConfig.push(item);
                }
            }
        }
        var restHttpRequestConfigs = [];
        if (restRequestConfigForm.rendered) {
            for (var i = 0; i < restRequestConfigForm.store.getCount(); i++) {
                restHttpRequestConfigs.push(restRequestConfigForm.store.getAt(i).getData());
            }
        }
        var notifyEmailConfig = [];
        if (notifyEmailConfigForm.rendered) {
            for (var i = 0; i < notifyEmailConfigForm.store.getCount(); i++) {
                notifyEmailConfig.push(notifyEmailConfigForm.store.getAt(i).getData());
            }
        }
        var JsonData = {
            'clazz': 'com.qpp.cgp.domain.order.AllotOrderNotifyConfig',
            'notifyTemplates': [
            ]/*,
             'postStatusId': postStatusId,
             'preStatusId': preStatusId,
             'serviceType': serviceType*/
        };
        if (restRequestConfigForm.rendered) {
            for (var i = 0; i < restHttpRequestConfigs.length; i++) {
                var notifyTemplatesItem = {
                    'clazz': 'com.qpp.cgp.domain.partner.order.config.ApiNotifyTemplate',
                    'enable': restHttpRequestConfigs[i].enable,
                    'type': restHttpRequestConfigs[i].type,
                    'name': restHttpRequestConfigs[i].name,
                    'description': restHttpRequestConfigs[i].description,
                    'apiNotifyTemplateConfig': {
                        'clazz': "com.qpp.cgp.domain.partner.order.config.ApiNotifyTemplateConfig",
                        'restHttpRequestConfig': restHttpRequestConfigs[i]
                    }
                };
                JsonData.notifyTemplates.push(notifyTemplatesItem);
            }
        } else {
            JsonData.notifyTemplates = Ext.Array.merge(JsonData.notifyTemplates, oldRestHttpRequestConfigs);
        }
        if (notifyEmailConfigForm.rendered) {
            for (var i = 0; i < notifyEmailConfig.length; i++) {
                if (notifyEmailConfig[i].type != 'manager') {
                    delete notifyEmailConfig[i].to;
                    delete notifyEmailConfig[i].cc;
                    delete notifyEmailConfig[i].bcc;
                }
                else {
                    Ext.isEmpty(notifyEmailConfig[i].to) ? delete notifyEmailConfig[i].to : '';
                    Ext.isEmpty(notifyEmailConfig[i].cc) ? delete notifyEmailConfig[i].cc : '';
                    Ext.isEmpty(notifyEmailConfig[i].bcc) ? delete notifyEmailConfig[i].bcc : '';
                }
                var notifyEmailConfigItem = {
                    'clazz': 'com.qpp.cgp.domain.partner.order.config.EmailNotifyTemplate',
                    'enable': notifyEmailConfig[i].enable,
                    'type': notifyEmailConfig[i].type,
                    'name': notifyEmailConfig[i].name,
                    'description': notifyEmailConfig[i].description,
                    'mailTemplateConfig': notifyEmailConfig[i]
                };
                JsonData.notifyTemplates.push(notifyEmailConfigItem);
            }
        } else {
            JsonData.notifyTemplates = Ext.Array.merge(JsonData.notifyTemplates, oldNotifyEmailConfig);
        }
        var method = 'PUT';

        var url = adminPath + 'api/producers/' + partnerId + '/allotOrderNotifyConfigs/' + recordId;
        if (createOrEdit == 'create') {
            method = 'POST'
            url = adminPath + 'api/producers/' + partnerId + '/allotOrderNotifyConfigs';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: JsonData,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'), function () {
                        /*   baseFrom.createOrEdit = 'edit';
                         baseFrom.recordId = responseMessage.data._id;
                         baseFrom.recordData = responseMessage.data;*/
                        restRequestConfigForm.createOrEdit = 'edit';
                        restRequestConfigForm.recordId = responseMessage.data._id;
                        restRequestConfigForm.recordData = responseMessage.data;
                        notifyEmailConfigForm.createOrEdit = 'edit';
                        notifyEmailConfigForm.recordId = responseMessage.data._id;
                        notifyEmailConfigForm.recordData = responseMessage.data;
                        /*
                         var orderStatusChangeEmailNotifyConfigFrame = top.Ext.getCmp("tabs").getComponent('supplierorderconfigedit');
                         orderStatusChangeEmailNotifyConfigFrame.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('orderStatusChangeEmailNotifyConfig'));
                         var tabs = top.Ext.getCmp('tabs');
                         var supplierorderconfigPanel = tabs.getComponent('supplierorderconfig');
                         tabs.setActiveTab(supplierorderconfigPanel);
                         top.document.getElementById("tabs_iframe_supplierorderconfig").contentWindow.Ext.getCmp('supplierorderconfigGrid').store.load();*/
                        myMask.hide();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    myMask.hide();
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                myMask.hide();
            }
        });
    },
    /**
     * 显示后台通知邮件配置
     * @param value
     */
    showServerMailTemplateConfigDetail: function (value) {
        var resultStr2 = [];
        if (!Ext.isEmpty(value.attachments)) {
            var amunt = 0;
            var data = value.attachments;
            for (var i = 0; i < data.length; i++) {
                var upLoadId = data[i].id;
                var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                var fileName = data[i].name;
                var url = data[i].url;
                var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                var id = 'file2' + (amunt++);
                var objDisplay = {
                    id: id,
                    width: 250,
                    name: name,
                    fileName: fileName,
                    hideLabel: true,
                    uploadId: upLoadId,
                    value: "<div id = '" + url + "' class='emailDiv'>" + fileName +
                        " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/></div>"
                };
                var displayField = new Ext.form.field.Display(objDisplay);
                resultStr2.push(displayField)
            }
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
                    name: 'isActive',
                    xtype: 'textfield',
                    readOnly: true,
                    width: 550,
                    fieldLabel: i18n.getKey('isActive'),
                    itemId: 'isActive',
                    value: value.enable

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
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    readOnly: true,
                    MinHeight: 150,
                    width: 550,
                    fieldLabel: i18n.getKey('attachments'),
                    itemId: 'attachmentsList',
                    items: resultStr2
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
                title: i18n.getKey('server') + i18n.getKey('notifyEmailConfig'),
                height: 600,
                width: 700,
                modal: true,
                layout: 'fit',
                items: form
            }).show();
        });
    },
    /**
     * 显示用户邮箱通知配置
     * @param value
     */
    showCustomerMailTemplateConfigDetail: function (value) {
        var resultStr2 = [];
        if (!Ext.isEmpty(value.attachments)) {
            var amunt = 0;
            var data = value.attachments;
            for (var i = 0; i < data.length; i++) {
                var upLoadId = data[i].id;
                var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                var fileName = data[i].name;
                var url = data[i].url;
                var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                var id = 'file2' + (amunt++);
                var objDisplay = {
                    id: id,
                    width: 250,
                    name: name,
                    fileName: fileName,
                    hideLabel: true,
                    uploadId: upLoadId,
                    value: "<div id = '" + url + "' class='emailDiv'>" + fileName +
                        " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/></div>"
                };
                var displayField = new Ext.form.field.Display(objDisplay);
                resultStr2.push(displayField)
            }
        }
        var items = [
            {
                name: 'isActive',
                xtype: 'textfield',
                readOnly: true,
                width: 550,
                fieldLabel: i18n.getKey('isActive'),
                itemId: 'isActive',
                value: value.enable

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
                xtype: 'fieldcontainer',
                layout: {
                    type: 'table',
                    columns: 2
                },
                readOnly: true,
                height: 150,
                width: 550,
                fieldLabel: i18n.getKey('attachments'),
                itemId: 'attachmentsList',
                items: resultStr2
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
            title: i18n.getKey('notifyEmailConfig'),
            height: 600,
            width: 700,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
    /**
     * 打开编辑新建restrequestConfig的panel
     * @param createOrEdit
     * @param store
     * @param tab
     * @param record
     * @param type
     */
    editNotifyEmailConfig: function (createOrEdit, store, tab, record, type) {
        if (createOrEdit == 'create') {
            record = Ext.create('CGP.partner.view.supplierorderconfig.model.NotifyEmailConfigModel');
        }
        var editOrCreateEmailConfigPanel = tab.getComponent('editOrCreateEmailConfigPanel2');
        tab.remove(editOrCreateEmailConfigPanel);
        editOrCreateEmailConfigPanel = Ext.create('CGP.partner.view.supplierorderconfig.view.EditOrCreateNotifyEmailConfig', {
            title: i18n.getKey(createOrEdit) + '_' + i18n.getKey('notifyEmailConfig'),
            itemId: 'editOrCreateEmailConfigPanel2',
            store: store,
            outTab: tab,
            record: record,
            createOrEdit: createOrEdit
        });
        tab.add(editOrCreateEmailConfigPanel);
        tab.setActiveTab(editOrCreateEmailConfigPanel);
    },
    /**
     * 保存通知邮件的配置
     * @param form
     * @param record
     * @param editConfigStore
     */
    saveNotifyEmailConfigValue: function (form, record, editConfigStore) {
        var baseConfig = form.getComponent('baseConfig');
        var serverMailConfig = form.getComponent('serverNotifyEmailConfig');
        if (form.isValid()) {
            var baseConfigValue = {};
            for (var i = 0; i < baseConfig.items.items.length; i++) {
                var item = baseConfig.items.items[i];
                baseConfigValue[item.getName()] = item.getValue();
            }
            var serverMailConfigValue = this.getServerMailConfigValue(serverMailConfig, baseConfigValue.type);
            var result = Ext.Object.merge(serverMailConfigValue, baseConfigValue);
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'), function () {
                var notifyEmailConfigPanel = form.outTab.getComponent('notifyEmailConfig');
                form.outTab.setActiveTab(notifyEmailConfigPanel);
                if (form.createOrEdit == 'create') {
                    for (var i in result) {
                        record.set(i, result[i]);
                    }
                    record.internalId = editConfigStore.data.length + 1;
                    editConfigStore.add(record);

                } else {
                    for (var i in result) {
                        record.set(i, result[i]);
                    }
                }
                form.close();
            })
        }
    }
})
