/**
 * Created by nan on 2020/7/29.
 */
Ext.define("CGP.editviewtypeconfigv3.model.EditViewConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'editViewTypeDomain',
            type: 'object'
        }, {
            name: 'areas',
            type: 'array'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.product.config.view.builder.dto.v3.EditViewTypeDto'
        }, {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        }, {
            name: 'modifiedBy',
            type: 'string'
        }, {
            name: 'modifiedDate',
            type: 'string'
        },
        {
            name: 'displayInfo',
            type: 'string',
            convert: function (value, record) {
                return record.get('description') + '(' + record.getId() + ')'
            }
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/editViewTypeDtos/v3',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
