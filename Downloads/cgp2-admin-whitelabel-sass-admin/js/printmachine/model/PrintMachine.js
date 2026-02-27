/**
 * printmachine model
 */
Ext.define('CGP.printmachine.model.PrintMachine',{
    extend : 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    idProperty:'_id',
    fields : [ {
        name : '_id',
        type : 'string',
        defaultValue: undefined,
        useNull: true
    },{
        name:'name',
        type:'string'
    },{
        name:'code', // 邮箱
        type:'string'
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.Printer'
    }    ],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/printers',
        reader:{
            type:'json',
            root:'data'
        }
    }
});