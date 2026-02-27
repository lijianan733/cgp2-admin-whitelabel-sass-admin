Ext.define('CGP.tools.fileupload.model.FileValidModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'size',
            type: 'number',
        }, {
            name: 'originalFileName',
            type: 'string',
        }, {
            name: 'path',
            type: 'string'
        }, {
            name: 'path',
            type: 'string'
        }, {
            name: 'url',
            type: 'string'
        }]
});
