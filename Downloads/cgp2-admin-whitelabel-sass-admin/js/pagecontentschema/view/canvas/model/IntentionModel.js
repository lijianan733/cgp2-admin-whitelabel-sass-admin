/**
 * Created by nan on 2021/10/11
 */
Ext.define('CGP.pagecontentschema.view.canvas.model.IntentionModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'element',
            type: 'object',
            useNull: true,
        },
        {
            name: 'intention',
            type: 'string'
        },
        {
            name: 'template',
            type: 'object',
            useNull: true
        },
        {
            name: 'businessLibFilter',
            type: 'array'

        }
    ]
});
