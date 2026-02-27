Ext.define('CGP.common.reprint.controller.Controller', {



    constructor: function () {


        this.callParent(arguments);
    },

    confirmReprintApply: function (itemId, form, window, status, data, callback) {

        var me = this;

        if (form) {
            if (!form.isValid()) {
                return;
            }
        }
        if (!data) {
            data = {
                status: status,
                qty: form.getComponent('qty').getValue(),
                remark: form.getComponent('remark').getValue()
            }
        }
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/admin/workLineItem/' + itemId + '/reprintApply',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    window.close();
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('submitSuccess'));
                    var data = response.data;
                    callback(data);

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }
})