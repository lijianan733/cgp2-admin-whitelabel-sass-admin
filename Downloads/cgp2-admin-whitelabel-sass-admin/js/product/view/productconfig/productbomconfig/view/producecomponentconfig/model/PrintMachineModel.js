/**
 * Created by nan on 2018/10/25.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.model.PrintMachineModel', {
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
            defaultValue: 'com.qpp.cgp.domain.common.Printer'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/printers',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
