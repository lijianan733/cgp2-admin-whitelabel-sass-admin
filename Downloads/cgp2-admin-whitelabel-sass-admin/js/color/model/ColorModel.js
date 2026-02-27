// 语言设置的的 model
Ext.define('CGP.color.model.ColorModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: 'id',
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
        name: 'c',
        type: 'number'
    }, {
        name: 'm',
        type: 'number'
    }, {
        name: 'y',
        type: 'number'
    }, {
        name: 'k',
        type: 'number'
    }, {
        name: 'displayCode',
        type: 'string'
    }, {
        name: 'displayCode2',
        type: 'string',
        convert: function (value, record) {
            var displayCode = record.get('displayCode');
            if(displayCode){
                return parseInt(displayCode.substr(1, 6), 16)
            }

        }
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
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
