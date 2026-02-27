Ext.define("CGP.tools.freemark.template.store.VariableKey", {
    extend: 'Ext.data.Store',
    requires:["CGP.tools.freemark.template.model.VariableKey"],
    model: "CGP.tools.freemark.template.model.VariableKey",
    proxy : {
        type : 'memory'
    }
});