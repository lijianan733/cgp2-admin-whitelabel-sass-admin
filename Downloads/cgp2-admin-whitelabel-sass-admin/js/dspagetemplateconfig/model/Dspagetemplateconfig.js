/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dspagetemplateconfig.model.Dspagetemplateconfig",{
    extend : 'Ext.data.Model',
    idProperty : '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields : [ {
        name : '_id',
        type : 'int',
        useNull: true
    },{
        name:'templateFileName',
        type:'string'
    },{
        name:'dataSourceId',
        type:'int'
    },{
        name:'pageType',
        type:'string'
    },{
        name:'description',
        type:'string'
    }],
    autoLoad:true,

    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/dynamicsize/pagetemplates',
        reader:{
            type:'json',
            root:'data'
        }
    }
});