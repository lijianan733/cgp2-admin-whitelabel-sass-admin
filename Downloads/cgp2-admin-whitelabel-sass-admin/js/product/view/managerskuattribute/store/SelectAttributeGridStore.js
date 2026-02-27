Ext.define('CGP.product.view.managerskuattribute.store.SelectAttributeGridStore', {
        extend: 'Ext.data.Store',
        request: 'CGP.product.view.managerskuattribute.model.SelectAttributeGridModel',
        model: 'CGP.product.view.managerskuattribute.model.SelectAttributeGridModel',
        proxy: {
            type: 'uxrest',
            url: '',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        autoLoad: true,
        constructor: function (config) {
            var me = this;
            me.proxy.url = config.proxyUrl;
            if (config.proxyReader) {
                me.proxy.reader = config.proxyReader;
            } else {
                me.proxy.reader = {
                    type: 'json',
                    root: 'data'
                };
            }
            me.callParent(config);
        }
    }
);

