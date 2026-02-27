/**
 * pagecontentschema model
 */
Ext.define('CGP.pagecontentschema.model.PriceArea',{
    extend : 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields : [{
        name: 'width',
        type: 'int'
    },{
        name: 'height',
        type: 'int'
    },{
        name: 'unitType',
        type: 'int'
    },{
        name: 'name',
        type: 'string'
    }]
});

