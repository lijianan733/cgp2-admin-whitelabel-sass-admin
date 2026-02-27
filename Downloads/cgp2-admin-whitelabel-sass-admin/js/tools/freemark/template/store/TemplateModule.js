/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.tools.freemark.template.store.TemplateModule", {
    extend: 'Ext.data.Store',
    requires:["CGP.tools.freemark.template.model.TemplateModule"],
    model: "CGP.tools.freemark.template.model.TemplateModule",
    proxy : {
        type : 'memory'
    }
});