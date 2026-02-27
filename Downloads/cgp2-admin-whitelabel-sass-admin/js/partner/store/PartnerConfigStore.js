Ext.define('CGP.partner.store.PartnerConfigStore', {
    extend:'Ext.data.Store',
    model: 'CGP.partner.model.PartnerConfigModel',
    partnerId: null,

    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/configurations/partners/{partnerId}/groups/19',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function(config) {
        var partnerId = config.partnerId;
        var groupId = config.groupId;
        this.proxy.url = adminPath + 'api/configurations/partners/'+partnerId+'/groups/'+groupId;
        this.callParent(arguments);
    }
})