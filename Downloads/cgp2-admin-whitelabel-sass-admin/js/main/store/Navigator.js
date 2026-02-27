Ext.define('CGP.main.store.Navigator', {
    extend: 'Ext.data.TreeStore',

    model:'CGP.main.model.Navigator',
    nodeParam: 'id',
    proxy: {
        type: 'ajax',
        url: adminPath + 'api/navigators',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type:'json',
            root: 'data'
        }
    },
    autoLoad: true,
    root: {
        text: 'userData',
        id: '1'
    }
})