/**
 * TaxProductCategory
 * @Author: miao
 * @Date: 2021/11/8
 */
Ext.define('CGP.tax.store.TaxProductCategory', {
    extend: 'Ext.data.Store',
    requires: ['CGP.tax.model.TaxProductCategory'],

    model: 'CGP.tax.model.TaxProductCategory',
    remoteSort: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    proxy: {
        type: 'uxrest',
        // url: adminPath + 'api/tax/{taxId}/productcategorys',
        url: adminPath + 'api/taxproductcategory',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me=this;
        if (config?.params) {
            me.proxy.extraParams = config.params;
            // me.proxy.url = adminPath + 'api/tax/'+config.taxId+'/productcategorys';
        }
        me.callParent(arguments);
    }
});