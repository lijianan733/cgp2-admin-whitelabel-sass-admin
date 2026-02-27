/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dsrequesttemplate.model.RequestTemplate",{
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
        name:'method',
        type:'string'
    },{
        name:'urlTemplate',
        type:'string'
    },{
        name:'description',
        type:'string'
    },{
        name:'bodyTemplate',
        type:'string'
    }],

    proxy:{
        type:'uxrest',
        url:adminPath + 'api/dynamicsize/requesttemplates',
        reader:{
            type:'json',
            root:'data'
        }
    }
});