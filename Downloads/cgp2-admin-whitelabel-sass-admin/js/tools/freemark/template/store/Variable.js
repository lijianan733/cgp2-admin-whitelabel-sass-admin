Ext.define("CGP.tools.freemark.template.store.Variable", {
    extend: 'Ext.data.Store',
    requires:["CGP.tools.freemark.template.model.Variable"],
    model: "CGP.tools.freemark.template.model.Variable",
    proxy : {
        type : 'memory'
    }
});