/**
 * AreaTaxLocal
 * @Author: miao
 * @Date: 2021/11/15
 */
Ext.define('CGP.tax.store.AreaTaxLocal', {
    extend: 'Ext.data.Store',
    requires: ['CGP.tax.model.AreaTax'],

    model: 'CGP.tax.model.AreaTax',
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    proxy : {
        type : 'memory'
    }
});