//同步到服务器
Ext.define('CGP.orderdetails.view.interface.Syncable', {



    sync: function () {

        var me = this;


        if (!me.order || !me.url) {
            throw new error('has no order data or url!');
        }

        var url = Ext.String.format(me.url, me.order.getId());
        Ext.Ajax.request({

            method: 'PUT',
            url: url,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: me.getSyncData(),
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    if (me.syncCallback)
                        me.syncCallback(response.data);
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'));
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })

    }
})