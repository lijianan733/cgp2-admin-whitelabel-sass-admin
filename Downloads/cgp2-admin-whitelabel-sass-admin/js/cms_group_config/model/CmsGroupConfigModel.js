/**
 * @Description
 * @author nan
 * @date 2025/8/1
 */
Ext.define('CGP.cms_group_config.model.CmsGroupConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true,
        },
        {
            name: 'clazz',
            type: 'string',
            defaults: 'com.qpp.cgp.domain.cms.CustomizeGroup'
        },
        {
            name: 'componentType',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'border',
            type: 'number'
        },
        //v1  profile v2 group
        {
            name: 'attributeSchemaVersion',
            type: 'string'
        },
        {
            name: 'orientation',
            type: 'string'
        },
        {
            name: 'fixedRow',
            type: 'boolean'
        },
        {
            name: 'number',
            type: "number"
        },
        {
            name: 'template',
            type: 'object'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cms/product/group-configs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})