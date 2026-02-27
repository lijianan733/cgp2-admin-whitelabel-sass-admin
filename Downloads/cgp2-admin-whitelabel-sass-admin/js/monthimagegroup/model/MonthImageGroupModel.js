Ext.define('CGP.monthimagegroup.model.MonthImageGroupModel',{
    extend:'Ext.data.Model',
    idProperty:'_id',
    fields:[{
        name : '_id',
        type:'string'
    },{
        name:'description',
        type:'string'
    },{
        name:'monthImageConditions', //地区
        type:'array'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/monthimagegroups',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
