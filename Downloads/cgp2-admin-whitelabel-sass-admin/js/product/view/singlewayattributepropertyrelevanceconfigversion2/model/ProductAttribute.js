/**
 * Created by admin on 2019/11/5.
 */

Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.ProductAttribute",{
    extend : 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'sortOrder',
        type: 'int'
    }, 'code', 'name', {
        name: 'required',
        type: 'boolean'
    }, 'inputType', 'validationExp', {
        name: 'showInFrontend',
        type: 'boolean'
    }, {
        name: 'useInCategoryNavigation',
        type: 'boolean'
    }, {
        name: 'options',
        type: 'array'
    },{
        name: 'multilingualKey',
        type: 'string',
        convert: function (value, record) {
            return record.raw?.clazz;
        }
    },{
        name: 'valueType',
        type: 'string'
    },{
        name: 'selectType',
        type: 'string'
    }]
});
