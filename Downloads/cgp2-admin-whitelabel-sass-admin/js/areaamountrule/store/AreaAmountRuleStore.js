/**
 * Created by nan on 2021/10/21.
 */
Ext.define('CGP.areaamountrule.store.AreaAmountRuleStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.areaamountrule.model.AreaAmountRuleModel',
    pageSize: 25,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url : adminPath + 'api/productadjustamount',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})