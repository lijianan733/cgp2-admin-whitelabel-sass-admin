/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.tools.freemark.template.store.Group", {
    extend: 'Ext.data.Store',
    requires:["CGP.tools.freemark.template.model.Group"],
    model: "CGP.tools.freemark.template.model.Group",
    proxy : {
        type : 'memory'
    }
});