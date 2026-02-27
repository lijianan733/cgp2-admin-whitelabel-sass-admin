/**
 * Created by admin on 2020/3/20.
 */
Ext.define('CGP.product.view.bothwayattributemapping.store.AttributeTreeLocal',{
    extend:'Ext.data.TreeStore',
    fields: ['text', 'children', 'propertyValue','skuAttributeid', 'skuAttribute', 'propertyName','recordData','profileName','entryLink'],
    proxy : {
        type : 'memory'
    },
    autoLoad:false,
    root: {
        expanded: true,
        children: []
    }

})