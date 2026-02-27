/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.product_location.model.ProductLocationModel',
    'CGP.qpmn_tax.view.CountryGridField'
]);
Ext.onReady(function () {
    var editPage = Ext.create('Ext.ux.ui.EditPage', {
        block: 'product_location',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.product_location.model.ProductLocationModel',
            fieldDefaults: {
                allowBlank: false,
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('_id'),
                    itemId: '_id',
                },
                {
                    xtype: 'hiddenfield',
                    name: 'clazz',
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.manufacture.ProductLocation'
                },

                {
                    xtype: 'textfield',
                    name: 'code',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code',
                },

            ]
        }
    });
});