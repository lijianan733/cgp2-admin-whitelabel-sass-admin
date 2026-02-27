Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'CGP.orderdetails',

    appFolder: 'app',
    controllers: [
        'Details'
    ],

    status: 1,

    launch: function () {
        var me = this;
        var permissions = Ext.create('CGP.orderdetails.controller.Permission');
        window.permissions = permissions;
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                xtype: 'details',
                region: 'center',
                status: me.status
            }]
        })
        /*Ext.Ajax.request({
            sync: false,
            method: 'GET',
            url: adminPath + 'api/users/containsRole?ids=7&ids=8&ids=9&ids=10',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {

                    if (response.data === true) {
                        me.status = 2;
                    }
                    Ext.create('Ext.container.Viewport', {
                        layout: 'border',
                        items: [{
                            xtype: 'details',
                            region: 'center',
                            status: me.status
                            }]
                    })
                } else {
                    Ext.Msg.alert('Prompt', 'Server Error!');
                }
            },
            failure: function (resp, operation) {
                Ext.Msg.alert('Prompt', 'Server Error!');
            }
        })*/
    }

});