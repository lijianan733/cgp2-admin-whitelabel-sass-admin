Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.RtType', {
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
            name: 'tags',
            type: 'string'
        },
        {
            name: 'parentId',
            type: 'string'
        }, {
            name: 'leaf',
            type: 'boolean'
        }, {
            name: 'isLeaf',
            type: 'boolean',
            convert: function (value, record) {
                return record.data.leaf
            }
        },
        {
            name: 'attributesToRtTypes',
            type: 'array',
            serialize: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }
        }
        , {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.bom.attribute.RtType'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: composingPath + 'api/pageConfigs/rtTypes/{id}/children',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
