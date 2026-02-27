/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dsurltemplate.model.UrlTemplate",{
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
        name:'type',
        type:'string',
        useNull: true
    },{
        name:'requestTemplateId',
        type:'int'
    },{
        name:'template',
        type:'string'
    },{
        name:'description',
        type:'string'
    },{
        name:'variables',
        type:'array'
    }],

    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/dynamicsize/urltemplates',
        reader:{
            type:'json',
            root:'data'
        }
    }
});