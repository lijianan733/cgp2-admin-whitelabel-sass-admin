/**
 * Created by nan on 2017/12/14.
 */
Ext.syncRequire(['CGP.numberrule.model.NumberRoleModel']);
Ext.define('CGP.numberrule.store.NumberRoleStore',{
    extend:'Ext.data.Store',
    model:'CGP.numberrule.model.NumberRoleModel',
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/numberRules',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true

})
