Ext.define('CGP.promotionrule.model.Promotion', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type:'int',
        useNull:true
    }, 'name','description','websiteName',{
        name:'websiteId',
        type: 'int'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/promotions',
        reader:{
            type: 'json',
            root: 'data'
        }
    }
})