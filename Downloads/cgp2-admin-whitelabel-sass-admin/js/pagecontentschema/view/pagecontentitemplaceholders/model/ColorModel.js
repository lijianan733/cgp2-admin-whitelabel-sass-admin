/**
 * Created by nan on 2021/3/22
 */
Ext.define('CGP.pagecontentschema.view.pagecontentitemplaceholders.model.ColorModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        }, {
            name: 'colorName',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'displayColor',
            type: 'object'
        }, {
            name: 'displayCode2',
            type: 'string',
            convert: function (value, record) {
                var displayCode = record.get('displayCode');
                return parseInt(displayCode.substr(1, 6), 16) + ''
            }
        }, {
            name: 'displayCode',
            type: 'string'
        }, {
            name: 'r',
            type: 'number'
        }, {
            name: 'g',
            type: 'number'
        }, {
            name: 'b',
            type: 'number'
        }, {
            name: 'color',
            type: 'string',
            convert: function (value, record) {
                var controller = Ext.create('CGP.color.controller.Controller');
                var data = record.getData();
                return controller.getColor(data);
            }
        }
    ]
})