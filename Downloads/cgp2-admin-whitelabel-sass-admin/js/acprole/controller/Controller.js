/**
 * Created by nan on 2018/8/16.
 */
Ext.define('CGP.acprole.controller.Controller', {
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
            var url = adminPath + 'api/security/acp/createRole';
            if (method == 'PUT') {
                url = adminPath + 'api/security/acp/' + recordId;
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
                        var editPanel = top.Ext.getCmp("tabs").getComponent('acprole_edit');
                        editPanel.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('acpRole'));
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
            var record = CGP.acprole.model.AcpRoleModel.load(recordId, {
                scope: this,
                failure: function (record, operation) {
                    mask.hide();
                },
                success: function (record, operation) {
                    var data = record.getData();
                    for (var i = 0; i < form.items.items.length; i++) {
                        var field = form.items.items[i];
                        var name = field.getName();
                        if (name == 'acpIds') {
                            var idArray = [];
                            var gridFiled = field;
                            for (var j = 0; j < data['abstractACPDTOS'].length; j++) {
                                idArray.push(data['abstractACPDTOS'][j]._id);
                            }
                            if (gridFiled.store.isLoading()) {
                                gridFiled.store.on('load', function () {
                                    field.setSubmitValue(idArray);
                                }, this, {
                                    single: true
                                })
                            } else {
                                field.setSubmitValue(idArray);
                            }
                        } else {
                            field.setValue(data[name]);
                        }
                    }
                    mask.hide();
                },
                callback: function (record, operation) {
                    mask.hide();
                }
            })
        }
    },
    setAcpWindow: function (data) {
        win = Ext.create('CGP.acprole.view.SelectAcpRoleWin', {
            data: data
        });
        win.show();

    }
})