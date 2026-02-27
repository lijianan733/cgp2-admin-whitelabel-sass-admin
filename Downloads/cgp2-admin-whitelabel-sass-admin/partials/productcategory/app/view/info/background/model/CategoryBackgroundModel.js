/**
 * Created by nan on 2020/12/26
 */
Ext.define('CGP.productcategory.view.info.background.model.CategoryBackgroundModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'displayName',
            type: 'string',
        }
    ]
});