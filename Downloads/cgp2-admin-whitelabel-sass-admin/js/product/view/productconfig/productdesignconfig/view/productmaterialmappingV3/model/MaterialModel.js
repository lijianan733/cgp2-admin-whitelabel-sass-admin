/**
 * @Description:
 * @author nan
 * @date 2022/7/27
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.MaterialModel', {
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
            name: 'code',
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
            convert: function (v, record) {
                return record.data.leaf;
            }
        }, {
            name: 'category',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'type',
            type: 'string',
            convert: function (value, record) {
                var clazz = record.get('clazz');
                if (clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                    return 'MaterialType'
                } else if (clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                    return 'MaterialSpu'
                }
            }
        },
        {
            name: 'displayName',
            type: 'string',
            convert: function (value, record) {
                return record.get('name') + '(' + record.get('_id') + ')'
            }
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materials',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
})