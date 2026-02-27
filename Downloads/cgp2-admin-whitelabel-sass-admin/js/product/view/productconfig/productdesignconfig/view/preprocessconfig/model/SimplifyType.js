/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.SimplifyType', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'designId',
            type: 'number'
        },
        {
            name: 'runWhenInit',
            type: 'boolean'
        },
        {
            name: 'isReversible',
            type: 'boolean'
        },
        {
            name: 'leftIsMain',
            type: 'boolean'
        },
        {
            name: 'left',
            type: 'array',

        },
        {
            name: 'right',
            type: 'array',
            convert:function (v,recd){
                var result=[];
                if(v instanceof Array){
                    result=v;
                }
                else {
                    result.push(v);
                }
                return result
            }
        },
        {
            name: 'selectorMappingRelations',
            type: 'array'
        },
        {
            name: 'materialViewMappingRelations',
            type: 'object'
        },
        {
            name:'cycleNumber',
            type:'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/tileProductPageContentPreprocessConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
