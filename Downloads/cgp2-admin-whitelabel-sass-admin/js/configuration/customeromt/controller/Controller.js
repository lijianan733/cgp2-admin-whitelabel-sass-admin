/**
 * Created by nan on 2018/1/25.
 */
Ext.syncRequire(['CGP.mailhistory.controller.Controller']);
Ext.define('CGP.configuration.customeromt.controller.Controller', {
    getFormValue: function (form) {
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
        returnValue.use = 'customer';
        returnValue.websiteId = form.websiteId;
        returnValue.clazz = 'com.qpp.cgp.domain.order.OrderStatusChangeMailConfig';
        return returnValue;
    },
    saveFormValue: function (value, createOrEdit, recordId) {
        var method = '';
        var extraParam = '';
        if (createOrEdit == 'create') {
            method = 'POST';
        } else {
            method = 'PUT';
            extraParam = '/' + recordId
        }
        Ext.Ajax.request({
            url: adminPath + 'api/orderStatusChangeMailConfigs' + extraParam,
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
                        window.parent.addCustEditTab(id, i18n.getKey('User Order Mail Template'))
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
        /*   var toData = record.get('mailTemplateConfig').to;
         var ccData = record.get('mailTemplateConfig').cc;
         var bccData = record.get('mailTemplateConfig').bcc;
         var to = form.getComponent('to');
         var cc = form.getComponent('cc');
         var bcc = form.getComponent('bcc');*/
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
                    var downLoadImgurl = path+'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                    var imgurl = path+'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                    var id = 'file' + (amunt++);
                    var objDisplay = {
                        id: id,
                        width: 250,
                        name: name,
                        fileName: fileName,
                        hideLabel: true,
                        uploadId: upLoadId,
                        value: "<div id = '" + url + "' class='emailDiv'>" + fileName +
                            " <img style='vertical-align: middle;width:15px; height:15px' src='"+ downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/>"+
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
                minHeight: 50,
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
            title: i18n.getKey('user')+i18n.getKey('notifyEmailConfig'),
            height: 600,
            width: 700,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    }
})