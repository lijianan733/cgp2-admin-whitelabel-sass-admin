/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcresource.model.PCResourceLibraryModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
    }, {//资源类的clazz
        name: 'library',
        type: 'object'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'businessLib',
        type: 'object'
    }, {
        name: 'productConfigDesign',
        type: 'object'
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.pcresource.BusinessLibraryOfProductConfigDesign'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/businessLibraryOfProductConfigDesigns',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
