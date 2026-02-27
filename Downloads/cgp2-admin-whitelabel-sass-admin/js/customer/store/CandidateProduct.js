Ext.define("CGP.customer.store.CandidateProduct", {
    extend: 'Ext.data.Store',
        model: 'CGP.partner.view.enableproductmanage.model.EnableProductModel',
        autoLoad: true,
        proxy: {
            type: 'uxrest',
            // url: mockPath + 'api/productAdministratorConfigs/user/{email}/products',
            url: adminPath + "api/products/users",
            reader: {
                type: 'json',
                root: "data.content"
            }
        },
        constructor: function (config) {
            var me = this;
            if(config.loginUserEmail&&config.targetUserEmail){
                me.proxy.extraParams={'loginUserEmail':config.loginUserEmail,'targetUserEmail':config.targetUserEmail};
            }
            me.callParent(arguments);
        }
    });
