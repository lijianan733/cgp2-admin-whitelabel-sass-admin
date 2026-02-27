/**
 * @Description:
 * @author nan
 * @date 2023/2/8
 */
Ext.define('CGP.common.conditionv2.model.ConditionTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'contentAttribute',
            type: 'object'
        },
        {
            name: 'operationType',
            type: 'string',
        },
        {
            name: 'operator',
            type: 'string'
        },
        {
            name: 'value',
            type: 'object'
        },
        'text',
        {
            name: 'source',
            type: 'object'
        },
        {
            name: 'icon',
            type: 'string',
            convert: function (value, record) {
                if (record.raw.clazz == 'LogicalOperation') {
                    return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png';
                } else {
                    return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_orange.png';
                }
            }
        },
        'clazz',
        {
            name: 'min',
            type: 'object'
        },
        {
            name: 'max',
            type: 'object'
        }
    ]
})