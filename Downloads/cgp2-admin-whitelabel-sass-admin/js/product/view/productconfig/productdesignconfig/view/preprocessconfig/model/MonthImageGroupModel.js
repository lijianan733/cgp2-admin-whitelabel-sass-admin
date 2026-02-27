/**
 * Created by nan on 2021/1/25
 */

/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.MonthImageGroupModel', {
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
            name: 'imageCondition',
            type: 'object'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.preprocess.holiday.MonthImageGroup'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/monthimagegroups',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
