/**
 * Created by nan on 2018/4/25.
 */
Ext.define('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.controller.MainController', {
    showMailTemplateConfigDetail: function (value) {
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
                title: i18n.getKey('notifyEmailConfig') + i18n.getKey('config'),
                height: 600,
                width: 700,
                modal: true,
                layout: 'fit',
                items: form
            }).show();
        });
    },

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
    getFormValue: function (form) {
        var items = form.items.items;
        var returnValue = {};
        returnValue.mailTemplateConfig = {};
        for (var i = 0; i < form.items.items.length; i++) {
            var item = form.items.items[i];
            if (item.xtype != 'form') {
                if (Ext.Array.contains(['to', 'cc', 'bcc'], item.getName())) {//处理收件人
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
                else if (item.getName() == 'subject') {//处理主题
                    returnValue.mailTemplateConfig[item.getName()] = item.items.items[0].getValue();
                } else {
                    returnValue.mailTemplateConfig[item.getName()] = item.getValue();
                }
            } else {//处理附件
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

                    returnValue.mailTemplateConfig[item.name] = getSubmitValue();
                }
            }
        }
        returnValue.mailTemplateConfig.clazz = 'com.qpp.cgp.domain.mail.MailTemplateConfig';
        returnValue.curStatusId = returnValue.mailTemplateConfig.curStatusId;
        delete returnValue.mailTemplateConfig.curStatusId;
        returnValue.preStatusId = returnValue.mailTemplateConfig.preStatusId;
        delete returnValue.mailTemplateConfig.preStatusId;
        returnValue.use = 'qp';
        returnValue.type = form.type;
        returnValue.partnerId = form.partnerId;
        returnValue.clazz = 'com.qpp.cgp.domain.partner.ProducerOrderStatusChangeMailConfig';
        return returnValue;
    },
    getCustomerFormValue: function (form) {
        var items = form.items.items;
        var returnValue = {};
        returnValue.mailTemplateConfig = {};
        for (var i = 0; i < form.items.items.length; i++) {
            var item = form.items.items[i];
            if (item.xtype != 'form') {
                if (Ext.Array.contains(['to', 'cc', 'bcc'], item.getName())) {
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

                    returnValue.mailTemplateConfig[item.name] = getSubmitValue();
                }
            }
        }
        returnValue.mailTemplateConfig.clazz = 'com.qpp.cgp.domain.mail.MailTemplateConfig';
        returnValue.curStatusId = returnValue.mailTemplateConfig.curStatusId;
        delete returnValue.mailTemplateConfig.curStatusId;
        returnValue.preStatusId = returnValue.mailTemplateConfig.preStatusId;
        delete returnValue.mailTemplateConfig.preStatusId;
        returnValue.use = 'qp';
        returnValue.type = form.type;
        returnValue.partnerId = form.partnerId;
        returnValue.clazz = 'com.qpp.cgp.domain.partner.ProducerOrderStatusChangeMailConfig';
        return returnValue;
    },
    saveFormValue: function (value, createOrEdit, recordId, form) {
        var tab = window.parent.Ext.getCmp('supplierOrderStatusChangeEmailNotifyConfig');
        var me = this;
        var method = '';
        var extraParam = '';
        if (createOrEdit == 'create') {
            method = 'POST';
        } else {
            method = 'PUT';
            extraParam = '/' + recordId
        }
        Ext.Ajax.request({
            url: adminPath + 'api/qppOrderStatusChangeMailConfigs' + extraParam,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: value,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var id = responseMessage.data._id;
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        var type = form.type == 'customer' ? 'editCustomerEmailNotifyConfig' : 'editBackstageEmailNotifyConfig';
                        var panel = tab.getComponent(type);
                        var copyButton = form.getDockedItems('toolbar[dock="top"]')[0].getComponent('copy');
                        copyButton.setDisabled(false);
                        panel.setTitle(i18n.getKey('edit') + "_" + i18n.getKey(form.type == 'customer' ? 'user' : 'server') + i18n.getKey('orderStatusChangeEmailNotifyConfig'));
                        form.createOrEdit = 'edit';
                        form.recordIdCopy = id;
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
    },
    setFormValue: function (form, record) {
        var subject = form.getComponent('subject');
        var content = form.getComponent('content');
        var preStatusId = form.getComponent('preStatusId');
        var curStatusId = form.getComponent('curStatusId');
        var attachments = form.getComponent('attachmentsList');
        var toData = record.get('mailTemplateConfig').to;
        var ccData = record.get('mailTemplateConfig').cc;
        var bccData = record.get('mailTemplateConfig').bcc;
        var to = form.getComponent('to');
        var cc = form.getComponent('cc');
        var bcc = form.getComponent('bcc');
        subject.items.items[0].setValue(record.get('mailTemplateConfig').subject);
        content.setValue(record.get('mailTemplateConfig').content);
        preStatusId.setValue(record.get('preStatusId'));
        curStatusId.setValue(record.get('curStatusId'));
        if (!Ext.isEmpty(record.get('mailTemplateConfig')['attachments'])) {
            var amunt = 0;
            attachments.removeAll();
            var controller = Ext.create('CGP.mailhistory.controller.Controller');
            var data = record.get('mailTemplateConfig')['attachments'];
            if (!Ext.isEmpty(data)) {
                for (var i = 0; i < data.length; i++) {
                    var upLoadId = data[i].id;
                    var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                    var fileName = data[i].name;
                    var url = data[i].url;
                    var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var id = 'file' + (amunt++);
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
    setCustomerFormValue: function (form, record) {
        var subject = form.getComponent('subject');
        var content = form.getComponent('content');
        var preStatusId = form.getComponent('preStatusId');
        var curStatusId = form.getComponent('curStatusId');
        var attachments = form.getComponent('attachmentsList');
        subject.items.items[0].setValue(record.get('mailTemplateConfig').subject);
        content.setValue(record.get('mailTemplateConfig').content);
        preStatusId.setValue(record.get('preStatusId'));
        curStatusId.setValue(record.get('curStatusId'));
        if (!Ext.isEmpty(record.get('mailTemplateConfig')['attachments'])) {
            var amunt = 0;
            attachments.removeAll();
            var controller = Ext.create('CGP.mailhistory.controller.Controller');
            var data = record.get('mailTemplateConfig')['attachments'];
            if (!Ext.isEmpty(data)) {
                for (var i = 0; i < data.length; i++) {
                    var upLoadId = data[i].id;
                    var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                    var fileName = data[i].name;
                    var url = data[i].url;
                    var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var id = 'file' + (amunt++);
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
    upLoadFile: function (button) {
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
                    var controller = Ext.create('CGP.mailhistory.controller.Controller');
                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var imgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
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
     * customer显示和编辑页
     * @param tab 外围tab
     * @param createOrEdit
     * @param partnerId
     * @param recordId
     */
    showCustomerEditOrCreateConfigPage: function (tab, createOrEdit, partnerId, recordId) {
        var panel = tab.getComponent('editCustomerEmailNotifyConfig');
        if (panel) {
            tab.remove(panel);
        }
        var extre = '?type=customer&recordId=' + recordId + '&partnerId=' + partnerId;
        if (!recordId) {
            extre = '?type=customer&partnerId=' + partnerId;
        }
        panel = tab.add({
            id: 'editCustomerEmailNotifyConfig',
            title: i18n.getKey(createOrEdit) + "_" + i18n.getKey('user') + i18n.getKey('orderStatusChangeEmailNotifyConfig'),
            html: '<iframe id="tabs_iframe_' + JSGetUUID() + '" src="' + path + 'partials/partner/supplierorderstatuschangeemailnotify/edit.html' + extre + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: true
        });
        tab.setActiveTab(panel);
    },
    /**
     * backstage显示和编辑页
     * @param tab 外围tab
     * @param createOrEdit
     * @param partnerId
     * @param recordId
     */
    showBackstageEditOrCreateConfigPage: function (tab, createOrEdit, partnerId, recordId) {
        var panel = tab.getComponent('editBackstageEmailNotifyConfig');
        if (panel) {
            tab.remove(panel);
        }
        var extre = '?type=backstage&recordId=' + recordId + '&partnerId=' + partnerId;
        if (!recordId) {
            extre = '?type=backstage&partnerId=' + partnerId;
        }
        panel = tab.add({
            id: 'editBackstageEmailNotifyConfig',
            title: i18n.getKey(createOrEdit) + "_" + i18n.getKey('server') + i18n.getKey('orderStatusChangeEmailNotifyConfig'),
            html: '<iframe id="tabs_iframe_' + JSGetUUID() + '" src="' + path + 'partials/partner/supplierorderstatuschangeemailnotify/edit.html' + extre + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: true
        });
        tab.setActiveTab(panel);
    },
    /**
     * 单个删除
     * @param view
     * @param rowIndex
     */
    deleteRecord: function (view, rowIndex) {
        Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
            var selected = view.getSelectionModel().getSelection();
            var store = view.getStore();
            var record = store.getAt(rowIndex);
            var recordId = record.getId();
            if (btn == 'yes') {
                view.loadMask.show();
                Ext.Ajax.request({
                    url: adminPath + 'api/qppOrderStatusChangeMailConfigs/' + recordId,
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            view.loadMask.hide();
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                            store.load();
                        } else {
                            view.loadMask.hide();
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        view.loadMask.hide();
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                });
            }
        })
    },
    /**
     *批量删除
     * @param view
     * @param store
     */
    batchDeleteRecord: function (view, store) {
        var grid = view.ownerCt.ownerCt;
        Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('是否删除所选数据？'), function (btn) {
            if (btn == 'yes') {
                grid.getView().loadMask.show();
                var selectItems = grid.getSelectionModel().getSelection();
                var deleteArray = [];
                for (var i = 0; i < selectItems.length; i++) {
                    Ext.Ajax.request({
                        url: adminPath + 'api/qppOrderStatusChangeMailConfigs/' + selectItems[i].getId(),
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        success: function (response) {
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            if (responseMessage.success) {
                                grid.getView().loadMask.hide();
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                    store.load();
                                });
                            } else {
                                grid.getView().loadMask.hide();
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        },
                        failure: function (response) {
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            grid.getView().loadMask.hide();
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);

                        }
                    });
                }
            }
        })
    }

})