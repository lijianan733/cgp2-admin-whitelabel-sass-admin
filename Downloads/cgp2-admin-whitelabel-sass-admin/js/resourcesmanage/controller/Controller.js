/**
 * Created by nan on 2018/8/9.
 */
Ext.define('CGP.resourcesmanage.controller.Controller', {
    /**
     *
     * @param form
     * @param resetBtn
     * @param mask
     * @param recordId
     */
    saveFormValue: function (form, resetBtn, mask, recordId) {
        if (form.isValid()) {
            mask.show();
            var formValues = form.getValues();
            var method = form.formCreateOrEdit == 'create' ? 'POST' : 'PUT';
            var jsonData = Ext.Object.merge(formValues, {
                clazz: 'com.qpp.security.domain.resource.ResourceType',
                idReference: 'ResourceType'
            })
            var url = adminPath + 'api/security/resources';
            if (method == 'PUT') {
                url = adminPath + 'api/security/resources/' + recordId;
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
                        var editPanel = top.Ext.getCmp("tabs").getComponent('resourcesManage_edit');
                        editPanel.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('resourcesManage'));
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
    /**
     *
     * @param recordId
     * @param form
     * @param createOrEdit
     * @param mask
     */
    loadRecord: function (recordId, form, createOrEdit, mask) {
        if (createOrEdit == 'edit') {
            mask.show();
            var record = CGP.resourcesmanage.model.ResourcesModel.load(recordId, {
                scope: this,
                failure: function (record, operation) {
                    mask.hide();
                },
                success: function (record, operation) {
                    var data = record.getData();
                    for (var i = 0; i < form.items.items.length; i++) {
                        var field = form.items.items[i];
                        var name = field.getName();
                        field.setValue(data[name]);
                    }
                    mask.hide();
                },
                callback: function (record, operation) {
                    mask.hide();
                }
            })
        }
    }
})
