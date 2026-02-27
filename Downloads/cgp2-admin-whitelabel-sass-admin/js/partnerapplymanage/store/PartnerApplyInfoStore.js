/**
 * Created by nan on 2018/1/30.
 */
Ext.syncRequire(['CGP.partnerapplymanage.model.PartnerApplyInfoModel']);
Ext.define('CGP.partnerapplymanage.store.PartnerApplyInfoStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.partnerapplymanage.model.PartnerApplyInfoModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/application',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true

})