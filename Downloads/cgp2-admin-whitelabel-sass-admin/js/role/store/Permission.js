Ext.define("CGP.role.store.Permission", {
    extend: 'Ext.data.TreeStore',
    requires: ['CGP.role.model.Permission'],

    model: 'CGP.role.model.Permission',
    proxy: {
        type: 'ajax',
        url: adminPath + 'api/permissions/check?access_token=' + Ext.util.Cookies.get('token'),
        reader: 'nestjson',
    },
    autoLoad: true,
    constructor: function () {
        var me = this;
        me.callParent(arguments);
        var proxy = me.getProxy();
        proxy.on('exception', function (thisProxy, response, Operation, eOpts) {
            if (response.status != 401) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.data) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey(responseText.data.message));
                }
            }
        });
    }
})