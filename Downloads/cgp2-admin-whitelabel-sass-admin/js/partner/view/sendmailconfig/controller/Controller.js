/**
 * Created by nan on 2018/6/11.
 */
Ext.define('CGP.partner.view.sendmailconfig.controller.Controller', {
    saveFormValue: function (form, resetBtn, mask, partnerId, recordId) {
        if (form.isValid()) {
            mask.show();
            var formValues = form.getValues();
            var method = form.formCreateOrEdit == 'create' ? 'POST' : 'PUT';
            var url = adminPath + 'api/partners/' + partnerId + '/notifyEmailSenders';
            if (method == 'PUT') {
                url = adminPath + 'api/partners/' + partnerId + '/notifyEmailSenders/' + recordId;
            }
            Ext.Ajax.request({
                url: url,
                method: method,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: formValues,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        mask.hide();
                        resetBtn.setDisabled(false);
                        form.formCreateOrEdit = 'edit';
                        form.recordId = responseMessage.data._id;
                        var editPanel = top.Ext.getCmp("tabs").getComponent('edit_endmailconfig');
                        editPanel.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('sendMailCfg'));
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                    } else {
                        mask.hide();
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    mask.hide();
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
    },
    loadRecord: function (partnerId, recordId, form, createOrEdit, mask) {
        CGP.partner.view.sendmailconfig.model.SendMailConfigModel.getProxy();
        CGP.partner.view.sendmailconfig.model.SendMailConfigModel.proxy.url = adminPath + 'api/partners/' + partnerId + '/notifyEmailSenders/' + recordId;
        if (createOrEdit == 'edit') {
            mask.show();
            var record = CGP.partner.view.sendmailconfig.model.SendMailConfigModel.load('', {
                scope: this,
                failure: function (record, operation) {
                    mask.hide();
                },
                success: function (record, operation) {
                    var data = record.getData();
                    for (var i in data) {
                        var field = form.getComponent(i);
                        field.setValue(data[i]);
                    }
                    mask.hide();
                },
                callback: function (record, operation) {
                    mask.hide();

                }
            })
        }
    }
});