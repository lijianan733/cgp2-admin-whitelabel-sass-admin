/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dssheettemplateconfig.model.SheetTemplateConfig",{
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
        name:'productType',
        type:'string'
    },{
        name:'description',
        type:'string'
    },{
        name:'sheetType',
        type:'string'
    },{
        name:'index',
        type:'int'
    },{
        name:'dataSourceId',
        type:'int'
    },{
        name:'strategy',
        type:'string'
    },{
        name:'condition',
        type:'string'
    },{
        name:'fileNameSuffix',
        type:'string'
    },{
        name:'textTemplateFileName',
        type:'string'
    },{
        name:'impressionPlaceholders',
        type:'array'
    },{
        name:'placeholders',
        type:'array'
    }],


    proxy:{
        type:'uxrest',
        url:adminPath + 'api/dynamicsize/sheettemplates',
        reader:{
            type:'json',
            root:'data'
        }
    }
});