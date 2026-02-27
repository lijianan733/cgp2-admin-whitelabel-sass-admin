/**
 * Created by nan on 2019/12/12.
 */
Ext.Loader.syncRequire(['CGP.product.view.mappinglink.model.MappingLinkModel']);
Ext.onReady(function () {
    var productId = JSGetQueryString('productId');
    var page = Ext.widget({
        i18nblock: i18n.getKey('mappingLink'),
        block: 'product/mappinglink',
        xtype: 'uxeditpage',
        outTabsId: 'tabs',
        returnMainPage: true,
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.product.view.mappinglink.model.MappingLinkModel',
            remoteCfg: false,
            items: [{
                name: 'linkName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('linkName'),
                itemId: 'linkName'
            }, {
                name: 'productId',
                xtype: 'textfield',
                hidden: true,
                value: productId,
                fieldLabel: i18n.getKey('productId'),
                itemId: 'productId'
            }]
        },
        listeners: {
            afterrender: function () {
                var page = this;
                var productId = JSGetQueryString('productId');
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        }

    });
})
