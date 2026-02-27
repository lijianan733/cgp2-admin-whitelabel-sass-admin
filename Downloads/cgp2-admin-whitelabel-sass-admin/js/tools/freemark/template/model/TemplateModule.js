/**
 * Created by admin on 2020/8/21.
 */
Ext.define('CGP.tools.freemark.template.model.TemplateModule', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'groups',
            type: 'array'
        },
        {
            name: 'varKeys',
            type: 'array'
        }
    ]
})