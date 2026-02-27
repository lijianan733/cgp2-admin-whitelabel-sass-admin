/**
 * Created by nan on 2020/7/29.
 */
Ext.define("CGP.editviewtypeconfig.model.EditViewConfigModel", {
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
            defaultValue: 'com.qpp.cgp.domain.product.config.view.builder.dto.EditViewTypeDto'
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
        }, {
            name: 'descriptionId',
            type: "string",
            convert: function (v, record) {
                var data = record.getData();
                return data.description +"("+data._id+")";
            }
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/editViewTypeDtos',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
