Ext.define("CGP.bommaterial.model.BomAttributeSets",{
    extend:'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    }],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/admin/bom/schema/attributeSets',
        reader:{
            type:'json',
            root:'data'
        }
    }
})