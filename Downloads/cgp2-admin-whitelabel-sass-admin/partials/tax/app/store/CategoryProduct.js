/**
 * CategoryProduct
 * @Author: miao
 * @Date: 2021/11/8
 */
Ext.define("CGP.tax.store.CategoryProduct", {
    extend: 'Ext.data.Store',
    requires: ['CGP.tax.model.CategoryProduct'],
    model: 'CGP.tax.model.CategoryProduct',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productoftax/{categoryId}/exists/products',
        reader: {
            type: 'json',
            root: "data.content"
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/productoftax/' + config.categoryId + '/exists/products';
        me.callParent(arguments);
    }
});