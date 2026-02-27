/**
 * Created by admin on 2020/8/21.
 */
Ext.define('CGP.tools.freemark.template.model.Group', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'variables',
            type: 'array'
        },
        {
            name: 'condition',
            type: 'object'
        }
    ]
})