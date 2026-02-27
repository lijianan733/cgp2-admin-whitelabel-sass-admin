/**
 * Created by nan on 2018/1/31.
 */
Ext.define('CGP.partnerapplyresultemailconfig.controller.Controller', {
        saveFormValue: function (value, createOrEdit, recordId) {
            var method = '';
            var extraParam = '';
            if (createOrEdit == 'create') {
                method = 'POST';
            } else {
                method = 'PUT';
                extraParam = '/' + recordId;
                value._id = recordId
            }
            Ext.Ajax.request({
                url: adminPath + 'api/websites/' + value.websiteId + '/partnerRegisterConfigs' + extraParam,
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
                            JSOpen({
                                id: 'partnerApplyResultEmailConfigEdit',
                                url: path + 'partials/partnerapplyresultemailconfig/edit.html?recordId=' + id,
                                title: i18n.getKey('edit') + '_' + i18n.getKey('partnerApplyResultEmailConfig'),
                                refresh: true
                            });
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
        getFormValue: function (form) {
            var defaultRoleIds = form.getComponent('defaultRoleIds').getValue();
            var websiteId = form.getComponent('websiteId').getValue();
            var verifyFailedNotificationConfig = form.getComponent('verifyFailedNotificationConfig');
            var verifyFailedNotificationConfigValue = this.getEmailComponentValue(form.getComponent('verifyFailedNotificationConfig'));
            var verifySuccessNotificationConfig = form.getComponent('verifySuccessNotificationConfig');
            var verifySuccessNotificationConfigValue = this.getEmailComponentValue(form.getComponent('verifySuccessNotificationConfig'));
            return {
                defaultRoleIds: defaultRoleIds,
                websiteId: websiteId,
                verifyFailedNotificationConfig: verifyFailedNotificationConfigValue,
                verifySuccessNotificationConfig: verifySuccessNotificationConfigValue,
                clazz: "com.qpp.cgp.domain.partner.config.PartnerRegisterConfig"
            }

        },
        getEmailComponentValue: function (form) {
            var items = form.items.items;
            var returnValue = {};
            returnValue.mailTemplateConfig = {};
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                if (item.xtype != 'form') {
                    if (Ext.Array.contains(['to', 'cc', 'bcc'], item.getName())) {
                        if (!Ext.isEmpty(item.getSubmitValue())) {
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
            returnValue.clazz = 'com.qpp.cgp.domain.partner.config.MailVerifyNotificationConfig';
            return returnValue;
        },
        setFormValue: function (form, record) {
            var defaultRoleIds = form.getComponent('defaultRoleIds');
            var websiteId = form.getComponent('websiteId');
            var verifyFailedNotificationConfig = form.getComponent('verifyFailedNotificationConfig');
            var verifySuccessNotificationConfig = form.getComponent('verifySuccessNotificationConfig');
            defaultRoleIds.setValue(record.get('defaultRoleIds'));
            websiteId.setValue(record.get('websiteId'));
            this.setFailedEmailConfig(verifyFailedNotificationConfig, record.get('verifyFailedNotificationConfig').mailTemplateConfig);
            this.setSuccessEmailConfig(verifySuccessNotificationConfig, record.get('verifySuccessNotificationConfig').mailTemplateConfig);
        },
        setFailedEmailConfig: function (component, value) {
            var subject = component.getComponent('subject');
            var content = component.getComponent('content');
            var attachments = component.getComponent('attachmentsList');
            subject.items.items[0].setValue(value.subject);
            content.setValue(value.content);
            if (!Ext.isEmpty(value['attachments'])) {
                var amunt = 0;
                attachments.removeAll();
                var controller = Ext.create('CGP.mailhistory.controller.Controller');
                var data = value['attachments'];
                if (!Ext.isEmpty(data)) {
                    for (var i = 0; i < data.length; i++) {
                        var upLoadId = data[i].id;
                        var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                        var fileName = data[i].name;
                        var url = data[i].url;
                        var imgurl = path+'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                        var downLoadImgurl =path+ 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
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
        setSuccessEmailConfig: function (component, value) {
            var subject = component.getComponent('subject1');
            var content = component.getComponent('content1');
            var attachments = component.getComponent('attachmentsList1');
            subject.items.items[0].setValue(value.subject);
            content.setValue(value.content);
            if (!Ext.isEmpty(value['attachments'])) {
                var amunt = 0;
                attachments.removeAll();
                var controller = Ext.create('CGP.mailhistory.controller.Controller');
                var data = value['attachments'];
                if (!Ext.isEmpty(data)) {
                    for (var i = 0; i < data.length; i++) {
                        var upLoadId = data[i].id;
                        var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                        var fileName = data[i].name;
                        var url = data[i].url;
                        var imgurl = path+'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                        var downLoadImgurl = path+'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                        var id = 'file2' + (amunt++);
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
        showMailTemplateConfigDetail: function (value) {
            var resultStr2 = [];
            if (!Ext.isEmpty(value.attachments)) {
                var amunt=0;
                var data=value.attachments;
                for (var i = 0; i < data.length; i++) {
                    var upLoadId = data[i].id;
                    var name = data[i].url.substring(data[i].url.lastIndexOf('/') + 1, data[i].url.length);
                    var fileName = data[i].name;
                    var url = data[i].url;
                    var imgurl = path+'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                    var downLoadImgurl = path+'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
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
                    xtype: 'htmleditor',
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
                title: i18n.getKey('mail') + i18n.getKey('config'),
                height: 600,
                width: 700,
                modal: true,
                layout: 'fit',
                items: form
            }).show();
        }
    }
)
