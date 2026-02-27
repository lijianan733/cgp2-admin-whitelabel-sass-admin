Ext.define("CGP.dssheettemplateconfig.store.Placeholder", {
    extend: 'Ext.data.Store',
    requires: ["CGP.dssheettemplateconfig.model.Placeholder"],

    model: 'CGP.dssheettemplateconfig.model.Placeholder',
    autoSync: true,
    proxy: {
        type: 'memory'
    },
    autoLoad: true
});
