Ext.define("CGP.bommaterial.model.MaterialModel",{
    extend:'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'code',
        type: 'string'
    },{
        name: 'attributeSetId',
        type: 'int'
    },{
        name: 'attributeSetName',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    },{
        name: 'customAttributes',
        type: 'array'
    }],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/admin/bom/schema/materials',
        reader:{
            type:'json',
            root:'data'
        }
    }
})