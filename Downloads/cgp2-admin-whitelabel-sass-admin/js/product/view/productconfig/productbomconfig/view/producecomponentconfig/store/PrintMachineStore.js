/**
 * Created by nan on 2018/10/25.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.PrintMachineStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.model.PrintMachineModel',
    pageSize: 15,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/printers',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})