Ext.define('CGP.bommaterial.store.MaterialBomItem', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.bommaterial.model.MaterialBomItem',
    proxy: {
        type: 'memory'
    },
    autoSync: true
})