/**
 * Created by nan on 2018/5/21.
 */
Ext.define('CGP.userdesigncategory.model.UserDesignCategoryModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.userdesign.UserDesignCategory'
        },
        {
            name: 'name',
            type: 'string'
        },{
            name:'icon',
            type:'string'
        }
    ]
})