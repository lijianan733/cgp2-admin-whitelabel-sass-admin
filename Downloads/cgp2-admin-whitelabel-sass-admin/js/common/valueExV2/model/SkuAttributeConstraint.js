/**
 * Created by nan on 2018/3/16.
 */
Ext.define('CGP.common.valueExV2.model.SkuAttributeConstraint', {
    extend: 'Ext.data.Model',
    fields: [
      
        {
            name: 'idReference',
            type: 'string'
        },{
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'include',
            type: 'boolean'
        },
        {
            name: 'description',
            type: 'string'
        },{
            name: 'conditions',
            type: 'object'
        },{
            name: 'validExpression',
            type: 'object'
        },{
            name: 'items',
            type: 'object'
        }
    ]
});
