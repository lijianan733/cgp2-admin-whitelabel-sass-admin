/**
 * Created by nan on 2020/12/26
 */
Ext.define('CGP.productcategory.view.info.background.store.CategoryBackgroundStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.productcategory.view.info.background.model.CategoryBackgroundModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productCategoryBackgrounds',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.categoryId) {
            me.proxy.url = adminPath + 'api/productCategories/' + config.categoryId + '/backgroundSeries';
        }
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
