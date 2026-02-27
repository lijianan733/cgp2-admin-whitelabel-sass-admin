/**
 * Created by nan on 2020/4/3.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.MaterialMappingDTOConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'materialPath',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'spuRtObjectMappings',
            type: 'array'
        },
        {
            name: 'bomItemMappings',
            type: 'array'
        },
        {
            name: 'displayField',
            type: 'string',
            convert: function (value, record) {
                return record.get('_id') + '（物料路径：' + record.get('materialPath') + ')'
            }
        },
        {
            name: 'materialId',
            type: 'string',
            convert: function (value, record) {
                return record.get('materialPath').split(',').pop();
            }
        },
        {
            name: 'materialMappingId',
            type: 'string',
            convert: function (value, record) {
                return record.get('_id');
            }
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MaterialMappingDTOConfig'
        },
        {
            name: 'materialMappingConfigDomain',
            type: 'object'
        }, {
            name: 'materialMappingDomainId',
            type: 'string',
            convert: function (value, record) {
                return record.get('materialMappingConfigDomain')._id;
            }
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappingDTOConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
