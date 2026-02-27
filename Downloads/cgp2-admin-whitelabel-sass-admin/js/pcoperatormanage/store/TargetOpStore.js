Ext.define('CGP.pcoperatormanage.store.TargetOpStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.pcoperatormanage.model.TargetOpModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/operatorcontroller',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})
