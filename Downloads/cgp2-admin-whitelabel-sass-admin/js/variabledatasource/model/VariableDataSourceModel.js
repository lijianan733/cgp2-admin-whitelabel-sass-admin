/**
 * Created by nan on 2019/12/13.
 */
Ext.define('CGP.variabledatasource.model.VariableDataSourceModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'rtType',
            type: 'object',
        },
        {
            name: 'expression',
            type: 'string'
        },
        {
            name: 'quantityRange',
            type: 'object'
        },
        {
            name: 'selector',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name:'comboDisplay',
            type:'string',
            convert:function (v,rec){
                return rec.get('name')+'<'+rec.get('_id')+'>';
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/variableDataSources',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
