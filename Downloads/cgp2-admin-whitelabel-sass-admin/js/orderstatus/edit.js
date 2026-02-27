Ext.Loader.syncRequire('CGP.orderstatus.model.OrderStatusModel');
Ext.onReady(function () {

    var page = Ext.widget({
        block: 'orderstatus',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.orderstatus.model.OrderStatusModel',
            items: [{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                allowBlank: false,
                itemId: 'name'
   }, {
                name: 'frontendName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('displayName'),
                allowBlank: true,
                itemId: 'frontendName'
            }]
        }
    });




});